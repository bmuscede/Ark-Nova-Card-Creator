import { type StaticImageData } from 'next/image';

import plan0 from '../../public/img/maps/plan0.jpg';
import plan1 from '../../public/img/maps/plan1.jpg';
import plan1a from '../../public/img/maps/plan1a.jpg';
import plan2 from '../../public/img/maps/plan2.jpg';
import plan2a from '../../public/img/maps/plan2a.jpg';
import plan3 from '../../public/img/maps/plan3.jpg';
import plan3a from '../../public/img/maps/plan3a.jpg';
import plan4 from '../../public/img/maps/plan4.jpg';
import plan4a from '../../public/img/maps/plan4a.jpg';
import plan5 from '../../public/img/maps/plan5.jpg';
import plan5a from '../../public/img/maps/plan5a.jpg';
import plan6 from '../../public/img/maps/plan6.jpg';
import plan6a from '../../public/img/maps/plan6a.jpg';
import plan7 from '../../public/img/maps/plan7.jpg';
import plan7a from '../../public/img/maps/plan7a.jpg';
import plan8 from '../../public/img/maps/plan8.jpg';
import plan8a from '../../public/img/maps/plan8a.jpg';
import plan9 from '../../public/img/maps/plan9.jpg';
import plan10 from '../../public/img/maps/plan10.jpg';
import plan11 from '../../public/img/maps/plan11.jpg';
import plan12 from '../../public/img/maps/plan12.jpg';
import plan13 from '../../public/img/maps/plan13.jpg';
import plan14 from '../../public/img/maps/plan14.jpg';
import plana from '../../public/img/maps/plana.jpg';
import planT1 from '../../public/img/maps/planT1.jpg';

export const mapAssetManifest: Record<string, StaticImageData> = {
  plan0,
  plan1,
  plan1a,
  plan2,
  plan2a,
  plan3,
  plan3a,
  plan4,
  plan4a,
  plan5,
  plan5a,
  plan6,
  plan6a,
  plan7,
  plan7a,
  plan8,
  plan8a,
  plan9,
  plan10,
  plan11,
  plan12,
  plan13,
  plan14,
  plana,
  planT1,
};

export function getMapAsset(key: string): StaticImageData | undefined {
  return mapAssetManifest[key];
}