import clsx from "clsx";
import React from "react";

import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Native Inference",
    Svg: require("@site/static/img/front-page/api-interface-svgrepo-com.svg")
      .default,
    description: (
      <>
        Native libraries mean native speed. Models are run using code optimized
        for your device&apos;s CPU, and GPU. Get results in milliseconds... or
        less.
      </>
    ),
  },
  {
    title: "On-Device Not In Cloud",
    Svg: require("@site/static/img/front-page/mobile-app-svgrepo-com.svg")
      .default,
    description: (
      <>
        Running models on-device means no network latency, no privacy concerns,
        and perhaps most importantly no surprise usage bills at the end of the
        month.
      </>
    ),
  },
  {
    title: "Use MLKit Models, or Bring Your Own",
    Svg: require("@site/static/img/front-page/machine-vision-svgrepo-com.svg")
      .default,
    description: (
      <>
        Experiment with the built-in MLKit models, or use our simple API to load
        your own custom TFLite models for tasks like image&#x2011;labeling and
        object&#x2011;detection.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={clsx("row", "center-vert")}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
