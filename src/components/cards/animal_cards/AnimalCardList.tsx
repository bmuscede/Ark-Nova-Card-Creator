import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo } from 'react';

import { RatedAnimalCard } from '@/components/cards/animal_cards/RatedAnimalCard';
import CardList from '@/components/cards/shared/CardList';

import { AnimalCard } from '@/types/AnimalCard';
import { CardSource } from '@/types/CardSource';
import { IAnimalCard } from '@/types/IAnimalCard';
import { SortOrder } from '@/types/Order';
import {
  isAnimalTag,
  isContinentTag,
  isOtherTag,
  OtherTag,
  Tag,
} from '@/types/Tags';
import { filterAnimalsByText } from '@/utils/filter';
import { getAnimalCardModel } from '@/utils/GetAnimalCardModel';
import { useAnimalData } from './useAnimalData';

interface AnimalCardListProps {
  selectedTags?: Tag[];
  selectedRequirements?: Tag[];
  selectedCardSources?: CardSource[];
  textFilter?: string;
  sortOrder?: SortOrder;
  size?: number[];
  onCardCountChange: (count: number) => void;
  maxNum?: number;
  // ... any other filters
}

const filterAnimals = (
  animals: AnimalCard[],
  selectedTags: Tag[] = [],
  selectedRequirements: Tag[] = [],
  selectedCardSources: CardSource[] = [],
  textFilter = '',
  size: number[] = [0],
  t: (text: string) => string,
) => {
  // First apply text filter using the utility function
  const textFilteredAnimals = filterAnimalsByText(textFilter, animals, t);

  // Then apply other filters
  const res = textFilteredAnimals.filter(
    (animal) =>
      (selectedTags.filter(isAnimalTag).length === 0 ||
        selectedTags
          .filter(isAnimalTag)
          .some((tag) => animal.tags.includes(tag))) &&
      (selectedTags.filter(isContinentTag).length === 0 ||
        selectedTags
          .filter(isContinentTag)
          .some((tag) => animal.tags.includes(tag))) &&
      (selectedTags.filter(isOtherTag).length === 0 ||
        selectedTags
          .filter(isOtherTag)
          .some((tag) => animal.tags.includes(tag))) &&
      (selectedRequirements.length === 0 ||
        selectedRequirements.some(
          (req) =>
            (animal.requirements && animal.requirements.includes(req)) ||
            hasRockAndWaterRequirements(animal, req),
        )) &&
      (selectedCardSources.length === 0 ||
        selectedCardSources.some((src) => animal.source === src)) &&
      (size.length === 0 || size.includes(0) || size.includes(animal.size)),
  );

  return res;
};

export const AnimalCardList: React.FC<AnimalCardListProps> = ({
  selectedTags,
  selectedRequirements,
  selectedCardSources = [],
  textFilter,
  onCardCountChange,
  sortOrder = SortOrder.ID_ASC,
  size = [0],
  maxNum,
}) => {
  const { t } = useTranslation('common');

  const animalsData = useAnimalData();
  const filteredAnimals = filterAnimals(
    animalsData,
    selectedTags,
    selectedRequirements,
    selectedCardSources,
    textFilter,
    size,
    t,
  );

  const { ratedAnimalCards, originalCount } = useMemo(() => {
    const mappedAnimals: IAnimalCard[] = filteredAnimals.map((animal) => ({
      id: animal.id,
      animalCard: animal,
      model: getAnimalCardModel(animal),
    }));

    switch (sortOrder) {
      case SortOrder.ID_ASC:
        mappedAnimals.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case SortOrder.ID_DESC:
        mappedAnimals.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case SortOrder.DIFF_ASC:
        mappedAnimals.sort(
          (a, b) =>
            a.model.diffWithSpecialEnclosure - b.model.diffWithSpecialEnclosure,
        );
        break;
      case SortOrder.DIFF_DESC:
        mappedAnimals.sort(
          (a, b) =>
            b.model.diffWithSpecialEnclosure - a.model.diffWithSpecialEnclosure,
        );
        break;
    }

    const slicedAnimals =
      maxNum !== undefined ? mappedAnimals.slice(0, maxNum) : mappedAnimals;

    return {
      ratedAnimalCards: slicedAnimals,
      originalCount: mappedAnimals.length,
    };
  }, [filteredAnimals, sortOrder, maxNum]);

  useEffect(() => {
    onCardCountChange(originalCount);
  }, [originalCount, onCardCountChange]);

  return (
    <CardList>
      {ratedAnimalCards.map((ratedAnimalCard: IAnimalCard) => (
        <div
          key={ratedAnimalCard.id}
          className='-mb-12 scale-75 sm:mb-1 sm:scale-90 md:mb-4 md:scale-100'
        >
          <RatedAnimalCard
            key={ratedAnimalCard.id}
            cardData={ratedAnimalCard}
            showLink={true}
          />
        </div>
      ))}
    </CardList>
  );
};

const hasRockAndWaterRequirements = (animal: AnimalCard, req: Tag) => {
  if (req === OtherTag.Rock) {
    return animal.rock && animal.rock > 0;
  } else if (req === OtherTag.Water) {
    return animal.water && animal.water > 0;
  } else {
    return false;
  }
};
