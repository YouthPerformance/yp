// Temporary preview page for drill UI testing
// Remove after verification

import { stationaryPoundDrill } from "@/data/drills/stationary-pound";
import { generateDrillSchemaOrg } from "@/data/drills/drill-v3-types";
import { DrillPageClient } from "@/app/(main)/drills/[sport]/[category]/[slug]/DrillPageClient";

export default function DrillPreviewPage() {
  const drill = stationaryPoundDrill;
  const schemaOrg = generateDrillSchemaOrg(drill);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaOrg),
        }}
      />
      <DrillPageClient drill={drill} />
    </>
  );
}
