// eslint-disable-next-line import/no-unassigned-import
import "react";
// Augmentation of React
declare module "react" {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    global?: boolean;
    jsx?: boolean;
  }
}
