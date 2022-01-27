import React from "react";
import Link from "next/link";

export default function HeroBanner(props) {
  const banner = props.hero_banner;
  return (
    <div
      {...banner.$?.bg_color}
      className="hero-banner"
      style={{ background: banner.bg_color ? banner.bg_color : "" }}
    >
      <div className={`${props.title === "about" ? "about" : "home"}-content`}>
        {banner.banner_title && (
          <h1 {...banner.$?.banner_title} className="hero-title">{banner.banner_title}</h1>
        )}
        {banner.banner_description ? (
          <p {...banner.$?.banner_description}
            className={`hero-description ${props.title === "about"
              && "about-desc"}`}
          >
            {banner.banner_description}
          </p>
        ) : (
          ""
        )}
        {banner.call_to_action.title && banner.call_to_action.href ? (
          <Link href={banner.call_to_action.href}>
            <a {...banner.call_to_action.$?.title} className="btn tertiary-btn">{banner.call_to_action.title}</a>
          </Link>
        ) : (
          ""
        )}
      </div>
      {banner.banner_image ? (
        <img {...banner.banner_image.$?.url} alt={banner.banner_image.filename} src={banner.banner_image.url} />
      ) : (
        ""
      )}
    </div>
  );
}
