import React, { useEffect, useMemo } from 'react';

import { RatedEndGameCard } from '@/components/cards/endgame_cards/RatedEndGameCard';
import CardList from '@/components/cards/shared/CardList';
import { EndGameData } from '@/data/EndGames';
import { CardSource } from '@/types/CardSource';
import { EndGameCard, IEndGameCard } from '@/types/EndGameCard';
import { SortOrder } from '@/types/Order';

interface EndGameCardListProps {
  selectedCardSources?: CardSource[];
  textFilter?: string;
  sortOrder?: SortOrder;
  onCardCountChange: (count: number) => void;
}

const filterCards = (
  cards: EndGameCard[],
  selectedCardSources: CardSource[] = [],
  textFilter = '',
) => {
  const lowercaseFilter = textFilter.toLowerCase();

  return cards.filter(
    (card) =>
      (selectedCardSources.length === 0 ||
        selectedCardSources.some((src) => card.source === src)) &&
      (textFilter === '' ||
        card.id.toLowerCase().includes(lowercaseFilter) ||
        card.name.toLowerCase().includes(lowercaseFilter)),
  );
};

export const EndGameCardList: React.FC<EndGameCardListProps> = ({
  selectedCardSources = [],
  textFilter,
  onCardCountChange,
  sortOrder = SortOrder.ID_ASC,
}) => {
  const filteredEndGames = useMemo(
    () => filterCards(EndGameData, selectedCardSources, textFilter),
    [selectedCardSources, textFilter],
  );

  const ratedEndGameCards: IEndGameCard[] = useMemo(() => {
    return filteredEndGames.map((card) => ({
      id: card.id,
      endGameCard: card,
    }));
  }, [filteredEndGames]);

  useEffect(() => {
    onCardCountChange(filteredEndGames.length);
  }, [filteredEndGames.length, onCardCountChange]);

  const sortedEndGames = useMemo(() => {
    const sortedCards = [...ratedEndGameCards];

    switch (sortOrder) {
      case SortOrder.ID_DESC:
        sortedCards.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case SortOrder.ID_ASC:
      default:
        sortedCards.sort((a, b) => a.id.localeCompare(b.id));
    }

    return sortedCards;
  }, [ratedEndGameCards, sortOrder]);

  return (
    <CardList>
      {sortedEndGames.map((ratedEndGameCard: IEndGameCard) => (
        <div
          key={ratedEndGameCard.id}
          className='-mb-8 -ml-6 scale-75 md:scale-100 lg:mb-2 lg:ml-8 xl:ml-0'
        >
          <RatedEndGameCard
            key={ratedEndGameCard.id}
            cardData={ratedEndGameCard}
            showLink={true}
          />
        </div>
      ))}
    </CardList>
  );
};
