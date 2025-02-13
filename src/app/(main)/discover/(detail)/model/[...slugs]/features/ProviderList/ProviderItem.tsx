import { ModelTag, ProviderCombine } from '@lobehub/icons';
import { ActionIcon, Grid, Icon, Tooltip } from '@lobehub/ui';
import { Tag } from 'antd';
import { createStyles } from 'antd-style';
import { BadgeCheck, BookIcon, ChevronRightIcon, KeyIcon } from 'lucide-react';
import Link from 'next/link';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';
import urlJoin from 'url-join';

import InterceptingLink from '@/components/InterceptingLink';
import { DEFAULT_MODEL_PROVIDER_LIST } from '@/config/modelProviders';
import { BASE_PROVIDER_DOC_URL } from '@/const/url';
import { DiscoverProviderItem } from '@/types/discover';
import { formatPriceByCurrency, formatTokenNumber } from '@/utils/format';

import Statistic, { type StatisticProps } from '../../../../../components/Statistic';

const useStyles = createStyles(({ css, token }) => ({
  tagGreen: css`
    color: ${token.colorSuccess};
    background: ${token.colorSuccessBgHover};
  `,
}));

interface ProviderItemProps extends DiscoverProviderItem {
  mobile?: boolean;
  modelId: string;
}

const ProviderItem = memo<ProviderItemProps>(({ mobile, modelId, identifier }) => {
  const { t } = useTranslation('discover');
  const { styles, theme } = useStyles();
  const isLobeHub = identifier === 'lobehub';

  const model = useMemo(() => {
    const prividerItem = DEFAULT_MODEL_PROVIDER_LIST.find((v) => v.id === identifier);
    if (!prividerItem) return;
    return prividerItem.chatModels.find((m) => m.id.toLowerCase().includes(modelId.toLowerCase()));
  }, [identifier, modelId]);

  const items: StatisticProps[] = [
    {
      title: t('models.contentLength'),
      value: model?.tokens ? formatTokenNumber(model.tokens) : '--',
    },
    {
      title: t('models.providerInfo.maxOutput'),
      tooltip: t('models.providerInfo.maxOutputTooltip'),
      value: model?.maxOutput ? formatTokenNumber(model.maxOutput) : '--',
    },
    {
      title: t('models.providerInfo.input'),
      tooltip: t('models.providerInfo.inputTooltip'),
      value: model?.pricing?.input
        ? '$' + formatPriceByCurrency(model.pricing.input, model.pricing?.currency)
        : '--',
    },
    {
      title: t('models.providerInfo.output'),
      tooltip: t('models.providerInfo.outputTooltip'),
      value: model?.pricing?.output
        ? '$' + formatPriceByCurrency(model.pricing.output, model.pricing?.currency)
        : '--',
    },
    /* ↓ cloud slot ↓ */
    /* ↑ cloud slot ↑ */
  ];

  const header = (
    <Flexbox gap={4} style={{ minWidth: 240 }}>
      <InterceptingLink
        href={urlJoin('/discover/provider', identifier)}
        style={{ color: 'inherit' }}
      >
        <ProviderCombine provider={identifier} size={24} />
      </InterceptingLink>
      <Flexbox align={'center'} gap={6} horizontal>
        <ModelTag model={modelId} style={{ background: theme.colorFillQuaternary, margin: 0 }} />
        {isLobeHub && (
          <Tooltip title={t('models.providerInfo.officialTooltip')}>
            <Tag
              bordered={false}
              className={styles.tagGreen}
              icon={<Icon icon={BadgeCheck} />}
              style={{ margin: 0 }}
            />
          </Tooltip>
        )}
        {!isLobeHub && (
          <Tooltip title={t('models.providerInfo.apiTooltip')}>
            <Tag bordered={false} icon={<Icon icon={KeyIcon} />} style={{ margin: 0 }} />
          </Tooltip>
        )}
        <Tooltip title={t('models.guide')}>
          <Link href={urlJoin(BASE_PROVIDER_DOC_URL, identifier)} target={'_blank'}>
            <Tag bordered={false} icon={<Icon icon={BookIcon} />} style={{ margin: 0 }} />
          </Link>
        </Tooltip>
      </Flexbox>
    </Flexbox>
  );

  const button = (
    <InterceptingLink href={urlJoin('/discover/provider', identifier)} style={{ color: 'inherit' }}>
      <ActionIcon color={theme.colorTextDescription} icon={ChevronRightIcon} />
    </InterceptingLink>
  );

  return (
    <Flexbox
      align={'center'}
      gap={16}
      horizontal
      justify={'space-between'}
      padding={16}
      wrap={'wrap'}
    >
      {mobile && (
        <Flexbox align={'center'} horizontal justify={'space-between'}>
          {header}
          {button}
        </Flexbox>
      )}
      <Grid
        align={'center'}
        flex={1}
        gap={16}
        horizontal
        maxItemWidth={100}
        rows={mobile ? 2 : items.length + 1}
        style={{ minWidth: 240 }}
      >
        {!mobile && header}
        {items.map((item, index) => (
          <Statistic
            align={mobile ? 'flex-start' : 'center'}
            gap={4}
            key={index}
            valuePlacement={'bottom'}
            valueStyle={{ fontSize: 18 }}
            {...item}
          />
        ))}
      </Grid>
      {!mobile && button}
    </Flexbox>
  );
});

export default ProviderItem;
