'use client';

import { Grid } from '@lobehub/ui';
import { Empty } from 'antd';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import urlJoin from 'url-join';

import InterceptingLink from '@/components/InterceptingLink';
import { DiscoverAssistantItem } from '@/types/discover';

import SearchResultCount from '../../../components/SearchResultCount';
import Title from '../../../components/Title';
import VirtuosoGridList from '../../../components/VirtuosoGridList';
import Card from './Card';

export interface ListProps {
  category?: string;
  items?: DiscoverAssistantItem[];
  mobile?: boolean;
  searchKeywords?: string;
}

const List = memo<ListProps>(({ category, mobile, searchKeywords, items = [] }) => {
  const { t } = useTranslation('discover');

  const { all, recent, last } = useMemo(() => {
    const recentLength = mobile ? 4 : 8;
    return {
      all: items,
      last: items.slice(recentLength),
      recent: items.slice(0, recentLength),
    };
  }, [items, mobile]);

  if (searchKeywords) {
    if (!items || items?.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return (
      <>
        <SearchResultCount count={all.length} keyword={searchKeywords} />
        <VirtuosoGridList
          data={all}
          initialItemCount={24}
          itemContent={(_, item) => (
            <InterceptingLink
              href={urlJoin('/discover/assistant/', item.identifier)}
              key={item.identifier}
            >
              <Card showCategory variant={'compact'} {...item} />
            </InterceptingLink>
          )}
          style={{
            minHeight: '75vh',
          }}
        />
      </>
    );
  }

  return (
    <>
      <Title>{t('assistants.recentSubmits')}</Title>
      <Grid maxItemWidth={280} rows={4}>
        {recent.map((item) => (
          <InterceptingLink
            href={urlJoin('/discover/assistant/', item.identifier)}
            key={item.identifier}
          >
            <Card showCategory={!category} {...item} />
          </InterceptingLink>
        ))}
      </Grid>
      {last && last?.length > 0 && (
        <>
          <Title tag={last.length}>{t('assistants.list')}</Title>
          <VirtuosoGridList
            data={last}
            initialItemCount={12}
            itemContent={(_, item) => (
              <InterceptingLink
                href={urlJoin('/discover/assistant/', item.identifier)}
                key={item.identifier}
              >
                <Card showCategory={!category} variant={'compact'} {...item} />
              </InterceptingLink>
            )}
            style={{
              minHeight: '75vh',
            }}
          />
        </>
      )}
    </>
  );
});

export default List;
