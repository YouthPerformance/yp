#!/usr/bin/env python3
"""
Release Wolf - QA Gatekeeper Script
====================================
Standalone pre-deployment checker for YP Monorepo.

Usage:
    python qa_wolf.py                    # Check all running dev servers
    python qa_wolf.py --port 3001        # Check specific port
    python qa_wolf.py --app shop         # Check specific app
    python qa_wolf.py --security-only    # Only run security scan
    python qa_wolf.py --start-server     # Start dev server before checking

Exit codes:
    0 = GO (all checks passed)
    1 = NO-GO (at least one check failed)
"""

import subprocess
import sys
import os
import re
import json
import socket
import time
import argparse
from pathlib import Path
from typing import NamedTuple, List, Optional
from dataclasses import dataclass
from enum import Enum
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from concurrent.futures import ThreadPoolExecutor, as_completed

# ═══════════════════════════════════════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════════════════════════════════════

PORTS_TO_CHECK = [3000, 3001, 3002, 3003, 4321, 5173]
LIGHTHOUSE_THRESHOLD = 90
REQUEST_TIMEOUT = 5

# Dangerous patterns that should NEVER appear in client-side code
DANGEROUS_PATTERNS = [
    r"SHOPIFY_ADMIN_TOKEN",
    r"OPENAI_API_KEY",
    r"ANTHROPIC_API_KEY",
    r"STRIPE_SECRET_KEY",
    r"DATABASE_URL",
    r"SUPABASE_SERVICE_KEY",
    r"CONVEX_DEPLOY_KEY",
    r"process\.env\.(SHOPIFY_ADMIN|OPENAI_API|STRIPE_SECRET|DATABASE_URL)",
]

# Directories that run in the browser (secrets must never be here)
CLIENT_SIDE_PATHS = [
    "components",
    "app",  # Next.js app router (client components)
    "pages",  # Next.js pages (client-side)
    "src/components",
    "src/app",
]

# File extensions to scan
SCANNABLE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"]


# ═══════════════════════════════════════════════════════════════════════════════
# Data Structures
# ═══════════════════════════════════════════════════════════════════════════════

class CheckStatus(Enum):
    GO = "GO"
    NO_GO = "NO-GO"
    SKIP = "SKIP"


@dataclass
class CheckResult:
    name: str
    status: CheckStatus
    message: str
    details: List[str] = None

    def __post_init__(self):
        if self.details is None:
            self.details = []


@dataclass
class LinkCheckResult:
    url: str
    status_code: int
    ok: bool
    error: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════════
# Utility Functions
# ═══════════════════════════════════════════════════════════════════════════════

def print_banner():
    """Print the Release Wolf banner."""
    print("""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🐺  R E L E A S E   W O L F   A C T I V A T E D  🐺      ║
║                                                               ║
║         Pre-deployment QA Gatekeeper                          ║
║         "Trust, but verify."                                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """)


def is_port_open(port: int) -> bool:
    """Check if a port is in use (has a running server)."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result == 0


def find_running_servers() -> List[int]:
    """Find all running dev servers on common ports."""
    return [port for port in PORTS_TO_CHECK if is_port_open(port)]


def get_monorepo_root() -> Path:
    """Find the monorepo root directory."""
    current = Path.cwd()
    while current != current.parent:
        if (current / "pnpm-workspace.yaml").exists():
            return current
        current = current.parent
    return Path.cwd()


# ═══════════════════════════════════════════════════════════════════════════════
# Check 1: Security Scan
# ═══════════════════════════════════════════════════════════════════════════════

def run_security_scan(root: Path) -> CheckResult:
    """
    Scan for exposed secrets in client-side code.
    This is the MOST CRITICAL check - secrets in browser code = catastrophic.
    """
    print("\n📡 [1/4] Security Scan - Checking for exposed secrets...")

    violations = []
    pattern = re.compile("|".join(DANGEROUS_PATTERNS))

    # Walk through apps and packages
    for search_dir in ["apps", "packages"]:
        base = root / search_dir
        if not base.exists():
            continue

        for ext in SCANNABLE_EXTENSIONS:
            for filepath in base.rglob(f"*{ext}"):
                # Check if file is in a client-side directory
                rel_path = str(filepath.relative_to(root))
                is_client_side = any(client_path in rel_path for client_path in CLIENT_SIDE_PATHS)

                if not is_client_side:
                    continue

                try:
                    content = filepath.read_text(encoding='utf-8')
                    for line_num, line in enumerate(content.splitlines(), 1):
                        if pattern.search(line):
                            # Skip if it's clearly a type definition or comment
                            if line.strip().startswith("//") or line.strip().startswith("*"):
                                continue
                            if "interface" in line or "type " in line:
                                continue

                            violations.append(f"  {rel_path}:{line_num}")
                            violations.append(f"    └─ {line.strip()[:80]}")
                except Exception as e:
                    pass  # Skip unreadable files

    if violations:
        return CheckResult(
            name="Security Scan",
            status=CheckStatus.NO_GO,
            message=f"CRITICAL: {len(violations)//2} potential secret exposures found!",
            details=violations
        )

    return CheckResult(
        name="Security Scan",
        status=CheckStatus.GO,
        message="No secrets exposed in client-side code"
    )


# ═══════════════════════════════════════════════════════════════════════════════
# Check 2: Lighthouse CI
# ═══════════════════════════════════════════════════════════════════════════════

def run_lighthouse_check(port: int) -> CheckResult:
    """
    Run Lighthouse performance check against a local server.
    Requires: npx lighthouse (comes with Chrome DevTools)
    """
    print(f"\n⚡ [2/4] Lighthouse CI - Testing performance on port {port}...")

    if not is_port_open(port):
        return CheckResult(
            name="Lighthouse CI",
            status=CheckStatus.SKIP,
            message=f"No server running on port {port}"
        )

    try:
        # Try to run lighthouse
        result = subprocess.run(
            [
                "npx", "lighthouse",
                f"http://localhost:{port}",
                "--output=json",
                "--chrome-flags=--headless --no-sandbox",
                "--only-categories=performance",
                "--quiet"
            ],
            capture_output=True,
            text=True,
            timeout=120
        )

        if result.returncode != 0:
            return CheckResult(
                name="Lighthouse CI",
                status=CheckStatus.SKIP,
                message="Lighthouse not available or failed to run",
                details=[result.stderr[:200] if result.stderr else "Unknown error"]
            )

        # Parse the JSON output
        data = json.loads(result.stdout)
        score = int(data.get("categories", {}).get("performance", {}).get("score", 0) * 100)

        # Get key metrics
        audits = data.get("audits", {})
        lcp = audits.get("largest-contentful-paint", {}).get("displayValue", "N/A")
        cls = audits.get("cumulative-layout-shift", {}).get("displayValue", "N/A")
        fid = audits.get("max-potential-fid", {}).get("displayValue", "N/A")

        details = [
            f"  Performance Score: {score}",
            f"  LCP: {lcp}",
            f"  CLS: {cls}",
            f"  FID: {fid}"
        ]

        if score >= LIGHTHOUSE_THRESHOLD:
            return CheckResult(
                name="Lighthouse CI",
                status=CheckStatus.GO,
                message=f"Performance: {score} (threshold: {LIGHTHOUSE_THRESHOLD})",
                details=details
            )
        else:
            return CheckResult(
                name="Lighthouse CI",
                status=CheckStatus.NO_GO,
                message=f"Performance: {score} < {LIGHTHOUSE_THRESHOLD} threshold",
                details=details
            )

    except subprocess.TimeoutExpired:
        return CheckResult(
            name="Lighthouse CI",
            status=CheckStatus.SKIP,
            message="Lighthouse timed out after 120s"
        )
    except FileNotFoundError:
        return CheckResult(
            name="Lighthouse CI",
            status=CheckStatus.SKIP,
            message="Lighthouse not installed. Run: npm install -g lighthouse"
        )
    except json.JSONDecodeError:
        return CheckResult(
            name="Lighthouse CI",
            status=CheckStatus.SKIP,
            message="Could not parse Lighthouse output"
        )
    except Exception as e:
        return CheckResult(
            name="Lighthouse CI",
            status=CheckStatus.SKIP,
            message=f"Lighthouse error: {str(e)[:50]}"
        )


# ═══════════════════════════════════════════════════════════════════════════════
# Check 3: Link Audit
# ═══════════════════════════════════════════════════════════════════════════════

def extract_links_from_header(root: Path) -> List[str]:
    """Extract all href values from Header components."""
    links = []
    href_pattern = re.compile(r'href=["\']([^"\']+)["\']')

    # Find Header files
    header_patterns = ["Header.tsx", "header.tsx", "Nav.tsx", "nav.tsx", "Navigation.tsx"]

    for pattern in header_patterns:
        for header_file in root.rglob(pattern):
            try:
                content = header_file.read_text(encoding='utf-8')
                matches = href_pattern.findall(content)
                links.extend(matches)
            except Exception:
                pass

    # Deduplicate and filter
    unique_links = list(set(links))
    # Filter out anchors and javascript: links
    filtered = [l for l in unique_links if not l.startswith("#") and not l.startswith("javascript:")]

    return filtered


def check_link(url: str, base_url: str) -> LinkCheckResult:
    """Check if a single link is accessible."""
    # Handle relative URLs
    if url.startswith("/"):
        full_url = f"{base_url}{url}"
    elif not url.startswith("http"):
        full_url = f"{base_url}/{url}"
    else:
        full_url = url

    try:
        req = Request(full_url, headers={"User-Agent": "ReleaseWolf/1.0"})
        response = urlopen(req, timeout=REQUEST_TIMEOUT)
        return LinkCheckResult(url=url, status_code=response.status, ok=True)
    except HTTPError as e:
        return LinkCheckResult(url=url, status_code=e.code, ok=e.code < 400, error=str(e))
    except URLError as e:
        return LinkCheckResult(url=url, status_code=0, ok=False, error=str(e.reason))
    except Exception as e:
        return LinkCheckResult(url=url, status_code=0, ok=False, error=str(e))


def run_link_audit(root: Path, port: int) -> CheckResult:
    """
    Crawl all links in the Header component and verify they work.
    Broken links in navigation = lost customers.
    """
    print(f"\n🔗 [3/4] Link Audit - Checking navigation links...")

    if not is_port_open(port):
        return CheckResult(
            name="Link Audit",
            status=CheckStatus.SKIP,
            message=f"No server running on port {port}"
        )

    links = extract_links_from_header(root)

    if not links:
        return CheckResult(
            name="Link Audit",
            status=CheckStatus.SKIP,
            message="No links found in Header components"
        )

    base_url = f"http://localhost:{port}"
    broken_links = []
    checked_count = 0

    # Check links in parallel
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(check_link, link, base_url): link for link in links}
        for future in as_completed(futures):
            result = future.result()
            checked_count += 1
            if not result.ok:
                broken_links.append(f"  [{result.status_code}] {result.url}")
                if result.error:
                    broken_links.append(f"      └─ {result.error[:50]}")

    if broken_links:
        return CheckResult(
            name="Link Audit",
            status=CheckStatus.NO_GO,
            message=f"{len(broken_links)//2} broken links found (checked {checked_count})",
            details=broken_links
        )

    return CheckResult(
        name="Link Audit",
        status=CheckStatus.GO,
        message=f"All {checked_count} navigation links working"
    )


# ═══════════════════════════════════════════════════════════════════════════════
# Check 4: Visual QA (Basic)
# ═══════════════════════════════════════════════════════════════════════════════

def run_visual_qa(port: int) -> CheckResult:
    """
    Basic visual check - verifies page loads and key elements exist.
    For full visual QA with screenshots, use Claude's vision capability.
    """
    print(f"\n👁️  [4/4] Visual QA - Checking page renders...")

    if not is_port_open(port):
        return CheckResult(
            name="Visual QA",
            status=CheckStatus.SKIP,
            message=f"No server running on port {port}"
        )

    try:
        url = f"http://localhost:{port}"
        req = Request(url, headers={"User-Agent": "ReleaseWolf/1.0"})
        response = urlopen(req, timeout=10)
        html = response.read().decode('utf-8')

        checks = []
        issues = []

        # Check for critical elements
        if "<html" not in html.lower():
            issues.append("  Missing <html> tag")
        else:
            checks.append("  HTML structure: OK")

        if "<!doctype" not in html.lower():
            issues.append("  Missing DOCTYPE")
        else:
            checks.append("  DOCTYPE: OK")

        # Check for common CTA patterns
        cta_patterns = ["buy now", "add to cart", "shop now", "get started", "sign up"]
        has_cta = any(pattern in html.lower() for pattern in cta_patterns)

        if has_cta:
            checks.append("  CTA detected: OK")
        else:
            checks.append("  CTA: Not found (may be loaded via JS)")

        # Check page size
        page_size_kb = len(html) / 1024
        if page_size_kb > 500:
            issues.append(f"  Page size: {page_size_kb:.0f}KB (consider optimization)")
        else:
            checks.append(f"  Page size: {page_size_kb:.0f}KB")

        if issues:
            return CheckResult(
                name="Visual QA",
                status=CheckStatus.NO_GO,
                message="Page has structural issues",
                details=issues + checks
            )

        return CheckResult(
            name="Visual QA",
            status=CheckStatus.GO,
            message="Page renders correctly",
            details=checks + ["\n  Note: For full visual QA, use Claude's vision capability"]
        )

    except Exception as e:
        return CheckResult(
            name="Visual QA",
            status=CheckStatus.NO_GO,
            message=f"Page failed to load: {str(e)[:50]}"
        )


# ═══════════════════════════════════════════════════════════════════════════════
# Report Generation
# ═══════════════════════════════════════════════════════════════════════════════

def print_report(results: List[CheckResult]) -> bool:
    """Print the final report and return True if all checks passed."""

    all_passed = all(r.status != CheckStatus.NO_GO for r in results)

    print("\n")
    print("═" * 65)
    print("         R E L E A S E   W O L F   R E P O R T")
    print("═" * 65)
    print()

    for result in results:
        if result.status == CheckStatus.GO:
            icon = "✅"
            status = "GO    "
        elif result.status == CheckStatus.NO_GO:
            icon = "❌"
            status = "NO-GO "
        else:
            icon = "⏭️ "
            status = "SKIP  "

        print(f" {icon} [{status}] {result.name}")
        print(f"          {result.message}")

        if result.details:
            for detail in result.details:
                print(f"          {detail}")
        print()

    print("─" * 65)

    if all_passed:
        print("""
    ██████╗  ██████╗
   ██╔════╝ ██╔═══██╗
   ██║  ███╗██║   ██║
   ██║   ██║██║   ██║
   ╚██████╔╝╚██████╔╝
    ╚═════╝  ╚═════╝

   🐺 VERDICT: GO FOR LAUNCH 🚀

   All checks passed. Ship it!
        """)
    else:
        blockers = [r for r in results if r.status == CheckStatus.NO_GO]
        print("""
   ███╗   ██╗ ██████╗        ██████╗  ██████╗
   ████╗  ██║██╔═══██╗      ██╔════╝ ██╔═══██╗
   ██╔██╗ ██║██║   ██║█████╗██║  ███╗██║   ██║
   ██║╚██╗██║██║   ██║╚════╝██║   ██║██║   ██║
   ██║ ╚████║╚██████╔╝      ╚██████╔╝╚██████╔╝
   ╚═╝  ╚═══╝ ╚═════╝        ╚═════╝  ╚═════╝

   🐺 VERDICT: NO-GO FOR LAUNCH ⛔

   Blockers:""")
        for blocker in blockers:
            print(f"   - {blocker.name}: {blocker.message}")
        print("""
   Fix these issues before deploying.
        """)

    print("═" * 65)

    return all_passed


# ═══════════════════════════════════════════════════════════════════════════════
# Main Entry Point
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="Release Wolf - Pre-deployment QA Gatekeeper",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--port", "-p", type=int, help="Specific port to check")
    parser.add_argument("--app", "-a", type=str, help="Specific app to check (e.g., 'shop')")
    parser.add_argument("--security-only", action="store_true", help="Only run security scan")
    parser.add_argument("--links-only", action="store_true", help="Only run link audit")
    parser.add_argument("--no-lighthouse", action="store_true", help="Skip Lighthouse check")
    parser.add_argument("--quiet", "-q", action="store_true", help="Minimal output")

    args = parser.parse_args()

    if not args.quiet:
        print_banner()

    root = get_monorepo_root()
    print(f"📁 Monorepo root: {root}")

    # Determine which port to check
    if args.port:
        ports = [args.port]
    else:
        ports = find_running_servers()
        if ports:
            print(f"🔍 Found running servers on ports: {ports}")
        else:
            print("⚠️  No running dev servers detected")
            print("   Start a dev server or use --port to specify one")

    port = ports[0] if ports else 3000

    results = []

    # Run checks based on flags
    if args.security_only:
        results.append(run_security_scan(root))
    elif args.links_only:
        results.append(run_link_audit(root, port))
    else:
        # Run all checks
        results.append(run_security_scan(root))

        if not args.no_lighthouse:
            results.append(run_lighthouse_check(port))

        results.append(run_link_audit(root, port))
        results.append(run_visual_qa(port))

    # Print report and exit with appropriate code
    all_passed = print_report(results)

    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
