import { FC } from "react";

export const socialLinksBySrc: { href: string; imgSrc: string }[] = [
  { href: "", imgSrc: "/imgs/opensea.svg" },
  { href: "", imgSrc: "/imgs/discord.svg" },
  { href: "", imgSrc: "/imgs/instagram.svg" },
  { href: "", imgSrc: "/imgs/twitter.svg" },
];

export const SocialBar: FC = () => {
  return (
    <>
      <div className="social-bar">
        {socialLinksBySrc.map(({ href, imgSrc }) => (
          <a key={imgSrc} href={href}>
            <img src={imgSrc} />
          </a>
        ))}
      </div>
      <style jsx>{`
        .social-bar :global(img) {
          width: 49px;
          height: 49px;
          cursor: pointer;
        }
        @media (max-width: 599px) {
          .social-bar :global(img) {
            width: 45px;
            height: 45px;
          }
        }

        .social-bar {
          position: absolute;
          top: 24px;
          right: 29px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-column-gap: 7px;
        }
        @media (max-width: 599px) {
          .social-bar {
            top: initial;
            bottom: 26px;
            grid-column-gap: 8px;
          }
        }
      `}</style>
    </>
  );
};
