import React from 'react';
import { CtaElement } from 'types/strapi/cta';
import Link from 'next/link';

import CTABlock from '@modules/common/components/blocks/cta-block';


const Cta: React.FC<CtaElement> = ({
  CtaTitle,
  CtaCaption,
  CtaCssClasses = "",
  CtaType = "default",
  CtaButton,
}) => {
  const baseStyles = "p-6 rounded-lg shadow-lg text-center";
  const typeStyles = {
    default: "bg-gray-100 text-gray-900",
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-800 text-white",
    warning: "bg-yellow-500 text-gray-900",
    success: "bg-green-500 text-white",
  };

  const resolvedStyles = `${baseStyles} ${typeStyles[CtaType as keyof typeof typeStyles] || typeStyles.default
    } ${CtaCssClasses}`;

  return (

    <div className={resolvedStyles}>

      <CTABlock
        className="min-h-[800px] lg:mx-12 lg:my-8 bg-bottom"
        wrapperCss=""
        direction="dx"
        title={CtaTitle ?? ''}
        titleSize="h3"
        titleCss="text-6xl text-ui-fg-base mb-16 lg:mg-0"
        paragraph={CtaCaption ?? ''}
        parCss="text-justify text-ui-fg-base px-4"
        backgroundImgUrl={""}
        haveCta={true}
        ctaLink={CtaButton?.ButtonLink ?? '/'}
        ctaText={CtaButton?.ButtonLabel ?? 'Home'}
        ctaCss={CtaButton?.ButtonCssClasses ?? 'mt-12'}
      />
    </div>
  );
};

export default Cta;