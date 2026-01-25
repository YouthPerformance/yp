#!/usr/bin/env python3
"""
Brand Asset Organizer & Optimizer
Consolidates, deduplicates, and optimizes all brand assets in the monorepo.
"""

import os
import shutil
import hashlib
import json
from pathlib import Path
from PIL import Image
import subprocess
from datetime import datetime

# Configuration
MONOREPO_ROOT = Path("/sessions/serene-youthful-shannon/mnt/yp-monorepo")
BRAND_ASSETS = MONOREPO_ROOT / "packages" / "brand-assets"

# Asset category mappings
ASSET_CATEGORIES = {
    "logos/primary": [
        "apps/marketing/public/logo/YP-LOGO.svg",
        "apps/marketing/public/logo/YOUTHPERFORMANCE.svg",
        "apps/marketing/public/logo/yp-logo.png",
    ],
    "logos/variants": [
        "apps/marketing/public/logo/wolffront.png",
        "apps/marketing/public/logo/ypfavblk.png",
        "apps/web-academy/public/logo/blackcyan.png",
        "apps/neoball-lp/public/favicon.svg",
    ],
    "logos/sports": [
        "apps/marketing/public/logos/nba.webp",
        "apps/marketing/public/logos/nfl.webp",
        "apps/marketing/public/logos/nhl.png",
        "apps/marketing/public/logos/mlb.webp",
        "apps/marketing/public/logos/ncaa.webp",
        "apps/marketing/public/logos/fifa.webp",
        "apps/marketing/public/logos/soccer.webp",
        "apps/marketing/public/logos/olympics.webp",
        "apps/web-academy/public/logos/premier.webp",
    ],
    "images/hero": [
        "apps/marketing/public/images/authyp.png",
        "apps/marketing/public/images/youthperformancewhite.webp",
        "apps/neoball-lp/public/images/neoballnaked.png",
        "apps/neoball-lp/public/images/court.webp",
    ],
    "images/team": [
        "apps/marketing/public/images/james/hero.jpeg",
        "apps/marketing/public/images/james/james1.jpeg",
        "apps/marketing/public/images/james/jamesmug.jpeg",
        "apps/marketing/public/images/james/jameslebron.jpeg",
        "apps/marketing/public/images/james/jameskobe.jpeg",
        "apps/marketing/public/images/james/jameskd.jpeg",
        "apps/marketing/public/images/james/jamesjimmy2.jpeg",
        "apps/marketing/public/images/james/jamesjimmyside.jpeg",
        "apps/marketing/public/images/james/jameschina.jpeg",
        "apps/marketing/public/images/james/jameschinakids.jpeg",
        "apps/marketing/public/images/james/jamesfamily.jpeg",
        "apps/marketing/public/images/james/james2.jpeg",
        "apps/marketing/public/images/james/jamesjimmy3.jpeg",
        "apps/marketing/public/images/james/jamessideprofile.png",
        "apps/web-academy/public/images/adam/adamprofile.png",
    ],
    "images/academy": [
        "apps/marketing/public/images/academy/1.jpeg",
        "apps/marketing/public/images/academy/2.jpeg",
        "apps/marketing/public/images/academy/3.jpeg",
        "apps/marketing/public/images/academy/4.jpeg",
    ],
    "images/icons": [
        "apps/marketing/public/images/courticon.webp",
        "apps/marketing/public/images/libraryicon.webp",
        "apps/marketing/public/images/performanceicon.webp",
        "apps/marketing/public/images/shoefoot.webp",
        "apps/marketing/public/images/spring.webp",
        "apps/web-academy/public/icons/shardcyan.png",
    ],
    "images/thumbnails": [
        "apps/marketing/public/images/thumb-court.webp",
        "apps/marketing/public/images/thumb-gym.webp",
        "apps/marketing/public/images/thumb-library.webp",
    ],
    "images/products": [
        "apps/shop/public/images/1.png",
        "apps/shop/public/images/2.jpg",
        "apps/shop/public/images/3.jpg",
        "apps/shop/public/images/4.jpg",
        "apps/shop/public/images/6.jpg",
        "apps/shop/public/images/7.png",
        "apps/shop/public/images/8.png",
        "apps/shop/public/images/9.jpg",
        "apps/shop/public/images/10.png",
        "apps/shop/public/images/11.png",
        "apps/shop/public/images/12.png",
        "apps/shop/public/images/13.png",
        "apps/shop/public/images/14.png",
        "apps/shop/public/images/16.png",
        "apps/shop/public/images/17.png",
        "apps/shop/public/images/18.png",
        "apps/shop/public/images/neoball-hero.png",
        "apps/shop/public/images/neoball-texture.png",
    ],
    "images/backgrounds": [
        "apps/shop/public/images/shopbg6.jpeg",
        "apps/neoball-lp/public/images/neoball-texture.png",
    ],
    "videos/loaders": [
        "apps/marketing/public/loader/loader.mp4",
        "apps/marketing/public/loader/loader.webm",
        "apps/marketing/public/loader/loadernew.mp4",
        "apps/marketing/public/loader/loadernew.webm",
    ],
    "videos/promotional": [
        "apps/marketing/public/webm/3dyp.mp4",
        "apps/marketing/public/webm/3dyp.webm",
        "apps/marketing/public/webm/3dyp.gif",
    ],
    "videos/product-demos": [
        "apps/marketing/public/videos/newspin.mp4",
    ],
    "audio/sfx": [
        "apps/web-academy/public/sounds/locker_latch.mp3",
        "apps/web-academy/public/sounds/plate_drop_heavy.mp3",
    ],
    "fonts": [
        "apps/marketing/public/fonts/SpaceGrotesk-VariableFont_wght.ttf",
        "apps/marketing/public/fonts/PowerGroteskTrial-Bold.woff",
        "apps/web-academy/public/fonts/BebasNeue-Regular.ttf",
    ],
}

def get_file_hash(filepath):
    """Calculate MD5 hash of a file for deduplication."""
    hasher = hashlib.md5()
    try:
        with open(filepath, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b''):
                hasher.update(chunk)
        return hasher.hexdigest()
    except:
        return None

def get_file_size(filepath):
    """Get file size in bytes."""
    try:
        return os.path.getsize(filepath)
    except:
        return 0

def format_size(size_bytes):
    """Format file size in human-readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"

def copy_asset(src, dest_category):
    """Copy asset to brand-assets folder."""
    src_path = MONOREPO_ROOT / src
    if not src_path.exists():
        return None, f"Source not found: {src}"

    dest_dir = BRAND_ASSETS / dest_category
    dest_dir.mkdir(parents=True, exist_ok=True)

    dest_path = dest_dir / src_path.name

    # Handle naming conflicts
    if dest_path.exists():
        # Check if it's the same file
        if get_file_hash(src_path) == get_file_hash(dest_path):
            return dest_path, "duplicate_skipped"
        # Rename with parent folder prefix
        parent_name = src_path.parent.name
        dest_path = dest_dir / f"{parent_name}_{src_path.name}"

    shutil.copy2(src_path, dest_path)
    return dest_path, "copied"

def optimize_image(filepath, quality=85, max_dimension=2000):
    """Optimize image: resize if too large, compress, create WebP version."""
    try:
        with Image.open(filepath) as img:
            original_size = os.path.getsize(filepath)

            # Get original dimensions
            width, height = img.size

            # Resize if larger than max_dimension
            if width > max_dimension or height > max_dimension:
                ratio = min(max_dimension / width, max_dimension / height)
                new_size = (int(width * ratio), int(height * ratio))
                img = img.resize(new_size, Image.LANCZOS)

            # Save optimized version
            ext = filepath.suffix.lower()

            if ext in ['.png']:
                # Optimize PNG
                img.save(filepath, 'PNG', optimize=True)
            elif ext in ['.jpg', '.jpeg']:
                # Convert to RGB if necessary (for JPEG)
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                img.save(filepath, 'JPEG', quality=quality, optimize=True)

            # Create WebP version
            webp_path = filepath.with_suffix('.webp')
            if img.mode == 'RGBA':
                img.save(webp_path, 'WEBP', quality=quality, lossless=False)
            else:
                rgb_img = img.convert('RGB')
                rgb_img.save(webp_path, 'WEBP', quality=quality, lossless=False)

            new_size = os.path.getsize(filepath)
            webp_size = os.path.getsize(webp_path)

            return {
                "original_size": original_size,
                "optimized_size": new_size,
                "webp_size": webp_size,
                "savings": original_size - new_size,
                "webp_path": str(webp_path)
            }
    except Exception as e:
        return {"error": str(e)}

def optimize_video(filepath, target_bitrate="2M"):
    """Create optimized WebM version of video."""
    try:
        webm_path = filepath.with_suffix('.webm')
        if webm_path.exists():
            return {"webm_exists": True, "webm_path": str(webm_path)}

        # Use ffmpeg to create WebM
        cmd = [
            'ffmpeg', '-i', str(filepath),
            '-c:v', 'libvpx-vp9',
            '-b:v', target_bitrate,
            '-c:a', 'libopus',
            '-y', str(webm_path)
        ]
        subprocess.run(cmd, capture_output=True, timeout=300)

        if webm_path.exists():
            return {
                "original_size": os.path.getsize(filepath),
                "webm_size": os.path.getsize(webm_path),
                "webm_path": str(webm_path)
            }
        return {"error": "WebM creation failed"}
    except Exception as e:
        return {"error": str(e)}

def main():
    print("=" * 60)
    print("BRAND ASSET ORGANIZER & OPTIMIZER")
    print("=" * 60)
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    results = {
        "copied": [],
        "skipped_duplicates": [],
        "not_found": [],
        "optimizations": [],
        "total_original_size": 0,
        "total_optimized_size": 0,
    }

    # Step 1: Copy and organize assets
    print("STEP 1: Organizing assets into brand-assets folder...")
    print("-" * 60)

    for category, files in ASSET_CATEGORIES.items():
        print(f"\n📁 {category}:")
        for src in files:
            dest_path, status = copy_asset(src, category)
            if status == "copied":
                size = get_file_size(dest_path)
                results["copied"].append({
                    "source": src,
                    "dest": str(dest_path),
                    "size": size
                })
                results["total_original_size"] += size
                print(f"  ✅ {Path(src).name} ({format_size(size)})")
            elif status == "duplicate_skipped":
                results["skipped_duplicates"].append(src)
                print(f"  ⏭️  {Path(src).name} (duplicate)")
            else:
                results["not_found"].append(src)
                print(f"  ❌ {Path(src).name} (not found)")

    # Step 2: Optimize images
    print("\n" + "=" * 60)
    print("STEP 2: Optimizing images...")
    print("-" * 60)

    image_extensions = {'.png', '.jpg', '.jpeg'}
    for category in ["images/hero", "images/team", "images/academy", "images/products", "images/icons", "images/backgrounds"]:
        category_path = BRAND_ASSETS / category
        if not category_path.exists():
            continue

        print(f"\n📷 Optimizing {category}:")
        for img_file in category_path.iterdir():
            if img_file.suffix.lower() in image_extensions:
                result = optimize_image(img_file)
                if "error" not in result:
                    savings_pct = (result["savings"] / result["original_size"] * 100) if result["original_size"] > 0 else 0
                    print(f"  ✅ {img_file.name}: {format_size(result['original_size'])} → {format_size(result['optimized_size'])} ({savings_pct:.1f}% saved)")
                    print(f"     WebP: {format_size(result['webp_size'])}")
                    results["optimizations"].append(result)
                    results["total_optimized_size"] += result["optimized_size"]
                else:
                    print(f"  ⚠️  {img_file.name}: {result['error']}")

    # Step 3: Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"✅ Assets copied: {len(results['copied'])}")
    print(f"⏭️  Duplicates skipped: {len(results['skipped_duplicates'])}")
    print(f"❌ Not found: {len(results['not_found'])}")
    print(f"📷 Images optimized: {len(results['optimizations'])}")

    total_savings = results["total_original_size"] - results["total_optimized_size"]
    if results["total_original_size"] > 0:
        savings_pct = (total_savings / results["total_original_size"]) * 100
        print(f"\n💾 Storage saved: {format_size(total_savings)} ({savings_pct:.1f}%)")

    print(f"\nCompleted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Save results as JSON
    results_path = BRAND_ASSETS / "organization_report.json"
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n📄 Report saved: {results_path}")

    return results

if __name__ == "__main__":
    main()
