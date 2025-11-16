import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Container } from '@/components/ui/Container';

type Props = {
  // Add custom props here
};

export default function HomePage(
  _props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Seo templateTitle='About' />

      <Container>
        <div className='mt-4'>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
            {t('about.title')}
          </h1>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            {t('about.intro')}
          </p>
          <h2 className='mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>
            {t('about.features.title')}
          </h2>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            {t('about.features.intro')}
          </p>
          <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
            <li>{t('about.features.li_1')}</li>
            <li>{t('about.features.li_2')}</li>
            <li>{t('about.features.li_3')}</li>
            <li>{t('about.features.li_4')}</li>
            <li>{t('about.features.li_5')}</li>
          </ul>
          <h3 className='mt-8 scroll-m-20 text-2xl font-semibold tracking-tight'>
            {t('about.features.plan_title')}
          </h3>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            {t('about.features.plan_intro')}
          </p>
          <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
            <li>{t('about.features.plan_li_1')}</li>
            <li>{t('about.features.plan_li_2')}</li>
            <li>{t('about.features.plan_li_3')}</li>
          </ul>
          <h2 className='mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>
            {t('about.thanks.title')}
          </h2>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            {t('about.thanks.translation')}
          </p>
          <h2 className='mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>
            {t('about.faq.title')}
          </h2>
        </div>

        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='item-1'>
            <AccordionTrigger>{t('about.faq.q_1')}</AccordionTrigger>
            <AccordionContent>
              {t('about.faq.a_1')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>{t('about.faq.q_2')}</AccordionTrigger>
            <AccordionContent>{t('about.faq.a_2')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>{t('about.faq.q_3')}</AccordionTrigger>
            <AccordionContent>{t('about.faq.a_3')}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'zh-CN', ['common'])),
  },
});
