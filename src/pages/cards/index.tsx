import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { FiRotateCcw } from 'react-icons/fi';

import { SortButton } from '@/components/buttons/SortButton';
import { EndGameCardList } from '@/components/cards/endgame_cards/EndGameCardList';
import { ProjectCardList } from '@/components/cards/project_cards/ProjectCardList';
import { CardSourceFilter } from '@/components/filters/CardSourceFilter';
import { CardTypeFilter } from '@/components/filters/CardTypeFilter';
import { TextFilter } from '@/components/filters/TextFilter';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { CardOdometer } from '@/components/ui/CardOdometer';
import { Separator } from '@/components/ui/separator';

import { CardType } from '@/types/Card';
import { CardSource } from '@/types/CardSource';
import { SortOrder } from '@/types/Order';

type Props = {
  // Add custom props here
};

export default function EndGamePage(
  _props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { t } = useTranslation('common');
  const [conservationCount, setConservationCount] = useState<number>(0);
  const [endGameCardsCount, setEndGameCardsCount] = useState<number>(0);
  const [reset, setReset] = useState<boolean>(false);
  const [textFilter, setTextFilter] = useState<string>('');
  const [selectedCardTypes, setSelectedCardTypes] = useState<CardType[]>([]);
  const [selectedCardSources, setSelectedCardSources] = useState<CardSource[]>(
    [],
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ID_ASC);

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  const resetAll = () => {
    setTextFilter('');
    setSelectedCardTypes([]);
    setSelectedCardSources([]);
    setConservationCount(0);
    setEndGameCardsCount(0);
    setSortOrder(SortOrder.ID_ASC);

    setReset(true);
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo templateTitle='Cards' />

      <main className='flex justify-center px-2 py-4 sm:px-4 lg:px-6'>
        <div className='flex w-full max-w-7xl flex-col space-y-4'>
          <div className='flex flex-col gap-3 rounded-xl border border-zinc-200/50 bg-white/50 p-3 shadow-sm backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/40 sm:p-4 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
              <CardTypeFilter
                cardTypes={[CardType.CONSERVATION_CARD, CardType.END_GAME_CARD]}
                onFilterChange={setSelectedCardTypes}
                reset={reset}
              />
              <Separator
                orientation='vertical'
                className='hidden h-10 bg-zinc-300 lg:inline-flex dark:bg-zinc-700'
              />
              <CardSourceFilter
                onFilterChange={setSelectedCardSources}
                reset={reset}
              />
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <TextFilter onTextChange={setTextFilter} reset={reset} />
              <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
              <button
                type='button'
                onClick={resetAll}
                className='group inline-flex items-center justify-center space-x-2 rounded-lg bg-zinc-700 px-3 py-2 text-sm font-medium text-zinc-100 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md transition hover:bg-zinc-600 hover:text-lime-400 focus:outline-none focus-visible:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20 dark:focus-visible:ring-yellow-500/80'
              >
                <FiRotateCcw />
                <span className='hidden sm:inline'>{t('Reset')}</span>
              </button>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:w-1/2 lg:gap-6'>
            <CardOdometer
              value={conservationCount}
              name={t('Conservation')}
              className='text-lime-500 hover:text-lime-600'
            />
            <CardOdometer
              value={endGameCardsCount}
              name={t('Endgame')}
              className='text-amber-500 hover:text-amber-600'
            />
          </div>
          <Separator className='bg-zinc-200 dark:bg-zinc-800' />
          <div className='flex justify-center'>
            {(selectedCardTypes.includes(CardType.CONSERVATION_CARD) ||
              selectedCardTypes.length === 0) && (
                <ProjectCardList
                  selectedCardSources={selectedCardSources}
                  textFilter={textFilter}
                  // sortOrder={sortOrder}
                  onCardCountChange={setConservationCount}
                />
              )}
          </div>
          <div className='flex justify-center'>
            {(selectedCardTypes.includes(CardType.END_GAME_CARD) ||
              selectedCardTypes.length === 0) && (
                <EndGameCardList
                  selectedCardSources={selectedCardSources}
                  textFilter={textFilter}
                  sortOrder={sortOrder}
                  onCardCountChange={setEndGameCardsCount}
                />
              )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'zh-CN', ['common'])),
  },
});
