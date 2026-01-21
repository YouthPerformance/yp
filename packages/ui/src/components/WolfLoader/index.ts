/**
 * WolfLoader - Premium Loading Experience
 * =======================================
 *
 * Progressive enhancement: Instant → Video → Unicorn WebGL
 *
 * @example
 * ```tsx
 * import { WolfLoader } from "@yp/ui";
 *
 * function App() {
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     // Simulate loading
 *     setTimeout(() => setLoading(false), 2000);
 *   }, []);
 *
 *   return (
 *     <>
 *       <WolfLoader
 *         isLoading={loading}
 *         onLoadComplete={() => console.log("Ready")}
 *       />
 *       <MainContent />
 *     </>
 *   );
 * }
 * ```
 */

export { WolfLoader, type WolfLoaderProps } from "./WolfLoader";
export { useUnicornStudio, type UnicornStatus, type UseUnicornStudioResult } from "./useUnicornStudio";
