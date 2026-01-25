/**
 * @yp/brand-assets
 * Centralized brand assets for Youth Performance monorepo
 *
 * Usage in apps:
 *   import { LOGOS, IMAGES, VIDEOS } from '@yp/brand-assets';
 *   <img src={LOGOS.primary.svg} alt="YP Logo" />
 */

// Logo paths
export const LOGOS = {
  primary: {
    svg: '/brand-assets/logos/primary/YP-LOGO.svg',
    png: '/brand-assets/logos/primary/yp-logo.png',
    wordmark: '/brand-assets/logos/primary/YOUTHPERFORMANCE.svg',
  },
  variants: {
    wolf: '/brand-assets/logos/variants/wolffront.png',
    favicon: '/brand-assets/logos/variants/ypfavblk.png',
    blackCyan: '/brand-assets/logos/variants/blackcyan.png',
    neoballFavicon: '/brand-assets/logos/variants/favicon.svg',
  },
  sports: {
    nba: '/brand-assets/logos/sports/nba.webp',
    nfl: '/brand-assets/logos/sports/nfl.webp',
    nhl: '/brand-assets/logos/sports/nhl.png',
    mlb: '/brand-assets/logos/sports/mlb.webp',
    ncaa: '/brand-assets/logos/sports/ncaa.webp',
    fifa: '/brand-assets/logos/sports/fifa.webp',
    soccer: '/brand-assets/logos/sports/soccer.webp',
    olympics: '/brand-assets/logos/sports/olympics.webp',
    premier: '/brand-assets/logos/sports/premier.webp',
  },
} as const;

// Image paths (original and WebP optimized versions)
export const IMAGES = {
  hero: {
    auth: {
      original: '/brand-assets/images/hero/authyp.png',
      webp: '/brand-assets/images/hero/authyp.webp',
    },
    white: '/brand-assets/images/hero/youthperformancewhite.webp',
    neoball: {
      original: '/brand-assets/images/hero/neoballnaked.png',
      webp: '/brand-assets/images/hero/neoballnaked.webp',
    },
    court: '/brand-assets/images/hero/court.webp',
  },
  team: {
    james: {
      hero: { original: '/brand-assets/images/team/hero.jpeg', webp: '/brand-assets/images/team/hero.webp' },
      portrait1: { original: '/brand-assets/images/team/james1.jpeg', webp: '/brand-assets/images/team/james1.webp' },
      portrait2: { original: '/brand-assets/images/team/james2.jpeg', webp: '/brand-assets/images/team/james2.webp' },
      mug: { original: '/brand-assets/images/team/jamesmug.jpeg', webp: '/brand-assets/images/team/jamesmug.webp' },
      sideProfile: { original: '/brand-assets/images/team/jamessideprofile.png', webp: '/brand-assets/images/team/jamessideprofile.webp' },
      withLebron: { original: '/brand-assets/images/team/jameslebron.jpeg', webp: '/brand-assets/images/team/jameslebron.webp' },
      withKobe: { original: '/brand-assets/images/team/jameskobe.jpeg', webp: '/brand-assets/images/team/jameskobe.webp' },
      withKD: { original: '/brand-assets/images/team/jameskd.jpeg', webp: '/brand-assets/images/team/jameskd.webp' },
      withJimmy1: { original: '/brand-assets/images/team/jamesjimmy2.jpeg', webp: '/brand-assets/images/team/jamesjimmy2.webp' },
      withJimmy2: { original: '/brand-assets/images/team/jamesjimmyside.jpeg', webp: '/brand-assets/images/team/jamesjimmyside.webp' },
      withJimmy3: { original: '/brand-assets/images/team/jamesjimmy3.jpeg', webp: '/brand-assets/images/team/jamesjimmy3.webp' },
      china: { original: '/brand-assets/images/team/jameschina.jpeg', webp: '/brand-assets/images/team/jameschina.webp' },
      chinaKids: { original: '/brand-assets/images/team/jameschinakids.jpeg', webp: '/brand-assets/images/team/jameschinakids.webp' },
      family: { original: '/brand-assets/images/team/jamesfamily.jpeg', webp: '/brand-assets/images/team/jamesfamily.webp' },
    },
    adam: {
      profile: { original: '/brand-assets/images/team/adamprofile.png', webp: '/brand-assets/images/team/adamprofile.webp' },
    },
  },
  academy: {
    photo1: { original: '/brand-assets/images/academy/1.jpeg', webp: '/brand-assets/images/academy/1.webp' },
    photo2: { original: '/brand-assets/images/academy/2.jpeg', webp: '/brand-assets/images/academy/2.webp' },
    photo3: { original: '/brand-assets/images/academy/3.jpeg', webp: '/brand-assets/images/academy/3.webp' },
    photo4: { original: '/brand-assets/images/academy/4.jpeg', webp: '/brand-assets/images/academy/4.webp' },
  },
  icons: {
    court: '/brand-assets/images/icons/courticon.webp',
    library: '/brand-assets/images/icons/libraryicon.webp',
    performance: '/brand-assets/images/icons/performanceicon.webp',
    shoe: '/brand-assets/images/icons/shoefoot.webp',
    spring: '/brand-assets/images/icons/spring.webp',
    shard: { original: '/brand-assets/images/icons/shardcyan.png', webp: '/brand-assets/images/icons/shardcyan.webp' },
  },
  thumbnails: {
    court: '/brand-assets/images/thumbnails/thumb-court.webp',
    gym: '/brand-assets/images/thumbnails/thumb-gym.webp',
    library: '/brand-assets/images/thumbnails/thumb-library.webp',
  },
  products: {
    product1: { original: '/brand-assets/images/products/1.png', webp: '/brand-assets/images/products/1.webp' },
    product2: { original: '/brand-assets/images/products/2.jpg', webp: '/brand-assets/images/products/2.webp' },
    product3: { original: '/brand-assets/images/products/3.jpg', webp: '/brand-assets/images/products/3.webp' },
    product4: { original: '/brand-assets/images/products/4.jpg', webp: '/brand-assets/images/products/4.webp' },
    product6: { original: '/brand-assets/images/products/6.jpg', webp: '/brand-assets/images/products/6.webp' },
    product7: { original: '/brand-assets/images/products/7.png', webp: '/brand-assets/images/products/7.webp' },
    product8: { original: '/brand-assets/images/products/8.png', webp: '/brand-assets/images/products/8.webp' },
    product9: { original: '/brand-assets/images/products/9.jpg', webp: '/brand-assets/images/products/9.webp' },
    product10: { original: '/brand-assets/images/products/10.png', webp: '/brand-assets/images/products/10.webp' },
    product11: { original: '/brand-assets/images/products/11.png', webp: '/brand-assets/images/products/11.webp' },
    product12: { original: '/brand-assets/images/products/12.png', webp: '/brand-assets/images/products/12.webp' },
    product13: { original: '/brand-assets/images/products/13.png', webp: '/brand-assets/images/products/13.webp' },
    product14: { original: '/brand-assets/images/products/14.png', webp: '/brand-assets/images/products/14.webp' },
    product16: { original: '/brand-assets/images/products/16.png', webp: '/brand-assets/images/products/16.webp' },
    product17: { original: '/brand-assets/images/products/17.png', webp: '/brand-assets/images/products/17.webp' },
    product18: { original: '/brand-assets/images/products/18.png', webp: '/brand-assets/images/products/18.webp' },
    neoballHero: { original: '/brand-assets/images/products/neoball-hero.png', webp: '/brand-assets/images/products/neoball-hero.webp' },
    neoballTexture: { original: '/brand-assets/images/products/neoball-texture.png', webp: '/brand-assets/images/products/neoball-texture.webp' },
  },
  backgrounds: {
    shop: { original: '/brand-assets/images/backgrounds/shopbg6.jpeg', webp: '/brand-assets/images/backgrounds/shopbg6.webp' },
    neoballTexture: { original: '/brand-assets/images/backgrounds/neoball-texture.png', webp: '/brand-assets/images/backgrounds/neoball-texture.webp' },
  },
} as const;

// Video paths (MP4 for compatibility, WebM for optimization)
export const VIDEOS = {
  loaders: {
    main: { mp4: '/brand-assets/videos/loaders/loader.mp4', webm: '/brand-assets/videos/loaders/loader.webm' },
    new: { mp4: '/brand-assets/videos/loaders/loadernew.mp4', webm: '/brand-assets/videos/loaders/loadernew.webm' },
  },
  promotional: {
    brand3d: {
      mp4: '/brand-assets/videos/promotional/3dyp.mp4',
      webm: '/brand-assets/videos/promotional/3dyp.webm',
      gif: '/brand-assets/videos/promotional/3dyp.gif',
    },
  },
  productDemos: {
    spin: '/brand-assets/videos/product-demos/newspin.mp4',
  },
} as const;

// Audio paths
export const AUDIO = {
  sfx: {
    lockerLatch: '/brand-assets/audio/sfx/locker_latch.mp3',
    plateDrop: '/brand-assets/audio/sfx/plate_drop_heavy.mp3',
  },
} as const;

// Font paths
export const FONTS = {
  spaceGrotesk: '/brand-assets/fonts/SpaceGrotesk-VariableFont_wght.ttf',
  powerGrotesk: '/brand-assets/fonts/PowerGroteskTrial-Bold.woff',
  bebasNeue: '/brand-assets/fonts/BebasNeue-Regular.ttf',
} as const;

// Helper function to get WebP with fallback
export function getOptimizedImage(
  imageObj: { original: string; webp: string } | string
): { src: string; srcSet?: string } {
  if (typeof imageObj === 'string') {
    return { src: imageObj };
  }
  return {
    src: imageObj.original,
    srcSet: `${imageObj.webp} 1x`,
  };
}

// Helper function to get video with fallback
export function getOptimizedVideo(
  videoObj: { mp4: string; webm: string }
): { mp4: string; webm: string } {
  return videoObj;
}

// Export types
export type LogoKey = keyof typeof LOGOS;
export type ImageCategory = keyof typeof IMAGES;
export type VideoCategory = keyof typeof VIDEOS;
