import { FC } from "react";

export const socialLinksBySrc: { href: string; imgSrc: string }[] = [
  { href: "", imgSrc: "/imgs/opensea_logo.png" },
  { href: "https://discord.gg/aXMDejtfK7", imgSrc: "/imgs/discord_logo.png" },
  {
    href: "https://www.instagram.com/stillz/",
    imgSrc: "/imgs/instagram_logo.png",
  },
  { href: "https://twitter.com/STAYSTILLZ", imgSrc: "/imgs/twitter_logo.png" },
];

export const SocialBar: FC = () => {
  return (
    <>
      <div className="wrapper">
        <div className="social-bar">
          {socialLinksBySrc.map(({ href, imgSrc }) => (
            <a key={imgSrc} href={href}>
              <img src={imgSrc} />
            </a>
          ))}
        </div>
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
            position: initial;
            top: initial;
            right: initial;
            bottom: 26px;
            grid-column-gap: 8px;
          }
          .wrapper {
            position: absolute;
            width: 100%;
            display: flex;
            justify-content: center;
            bottom: 26px;
          }
        }
      `}</style>
    </>
  );
};
