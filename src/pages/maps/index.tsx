import { HelpCircle, Sparkles } from 'lucide-react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useMemo, useState } from 'react';
import TextButton from '@/components/buttons/TextButton';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { getFromLocalStorage } from '@/lib/helper';
import { AlternativeMapBoards } from '@/data/AlternativeMapBoards';
import { mapAssetManifest } from '@/data/MapAssetManifest';
import { MapBoards } from '@/data/MapBoards';
import { MapBoard } from '@/types/MapBoard';

const MAP_SELECTION_KEY = 'ark-nova:selected-map-board';
const MAP_VARIANT_KEY = 'ark-nova:selected-map-variant';

type Props = {
  // Add custom props here if needed.
}

export default function HomePage(
  _props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { t } = useTranslation('common');
  const [alternativeMaps, setAlternativeMaps] = useState(false);
  const maps = useMemo(
    () => (alternativeMaps ? AlternativeMapBoards : MapBoards),
    [alternativeMaps],
  );
  const [selectedMap, setSelectedMap] = useState<MapBoard>(maps[0]);

  useEffect(() => {
    const storedVariant = getFromLocalStorage(MAP_VARIANT_KEY);
    const useAlternative = storedVariant === 'alternative';
    const storedSelection = getFromLocalStorage(MAP_SELECTION_KEY);
    const availableMaps = useAlternative ? AlternativeMapBoards : MapBoards;

    setAlternativeMaps(useAlternative);
    const persistedMap = availableMaps.find((map) => map.id === storedSelection);
    setSelectedMap(persistedMap ?? availableMaps[0]);
  }, []);

  useEffect(() => {
    const availableMaps = alternativeMaps ? AlternativeMapBoards : MapBoards;
    const persistedSelection = availableMaps.find((map) => map.id === selectedMap.id);
    const fallback = persistedSelection ?? availableMaps[0];

    if (selectedMap.id !== fallback.id) {
      setSelectedMap(fallback);
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        MAP_VARIANT_KEY,
        alternativeMaps ? 'alternative' : 'standard',
      );
    }
  }, [alternativeMaps, selectedMap.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MAP_SELECTION_KEY, selectedMap.id);
    }
  }, [selectedMap.id]);

  function handleSelectMap(map: MapBoard) {
    setSelectedMap(map);
  }

  function handleMapChange() {
    setAlternativeMaps(!alternativeMaps);
  }

  const mapImage =
    mapAssetManifest[selectedMap.image] ?? mapAssetManifest[maps[0].image];

  return (
    <Layout>
      <Seo templateTitle='Ark Nova Maps & Alternatives' />

      <div className='flex flex-col gap-4 px-2 py-2 md:px-4'>
        <Alert className='bg-lime-500/40'>
          <Sparkles className='h-4 w-4' />
          <AlertTitle>{t('maps.alternative_title')}</AlertTitle>
          <AlertDescription>
            <div className='flex justify-start gap-4'>
              <div className='max-w-2xl'>{t('maps.alternative_desc')}</div>
              <Switch
                checked={alternativeMaps}
                onCheckedChange={handleMapChange}
              />
            </div>
          </AlertDescription>
        </Alert>

        <div className='grid grid-cols-3 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {maps.map((mapBoard) => (
            <div key={mapBoard.name} className='w-min justify-self-center'>
              <TextButton
                selected={selectedMap === mapBoard}
                className='h-12 hover:text-lime-600'
                selectClassName='text-lime-600 ring-lime-600/90 ring-2'
                onClick={() => handleSelectMap(mapBoard)}
              >
                {t(mapBoard.name)}
              </TextButton>
            </div>
          ))}
        </div>
        <div className='flex w-full flex-col items-start justify-center rounded-lg bg-white/80 p-2 shadow-lg lg:p-4'>
          <Image
            alt={selectedMap.name}
            priority={true}
            src={mapImage}
            className='w-full rounded-md object-contain shadow-lg'
            quality={85}
            width={1000}
            height={1000}
          />
          <h1 className='scroll-m-20 pt-4 text-2xl font-extrabold tracking-tight text-lime-700 lg:text-4xl'>
            {t(selectedMap.name)}
          </h1>
          {selectedMap.description.length > 0 && (
            <p className='self-start leading-7 [&:not(:first-child)]:mt-6'>
              {t(selectedMap.description[0])}
            </p>
          )}
          {selectedMap.description.length > 1 && (
            <Accordion type='single' collapsible className='w-full'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>{t('maps.tips')}</AccordionTrigger>
                <AccordionContent>
                  <ul className='my-6 ml-6 list-disc'>
                    {selectedMap.description
                      .slice(1)
                      .map((description, index) => (
                        <li key={index}>{t(description)}</li>
                      ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {selectedMap.id === 'm14' && (
            <Link
              href='/people-sponsors'
              className='flex items-center text-lime-800 no-underline hover:underline'
            >
              <HelpCircle className='mr-1 h-6 w-6' />
              <div>{t('which-people-sponsors')}</div>
            </Link>
          )}
        </div>
        <div className='w-full rounded-lg bg-white/60 p-4 text-sm text-zinc-700 shadow'>
          Feel free to keep your own notes about each map locally while you explore different setups.
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'zh-CN', ['common'])),
  },
});
