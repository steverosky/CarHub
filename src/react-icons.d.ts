import { IconType } from 'react-icons';
import React from 'react';

declare module 'react-icons/fi' {
  export const FiMenu: IconType;
  export const FiUser: IconType;
  export const FiLogOut: IconType;
  export const FiX: IconType;
  export const FiMail: IconType;
  export const FiLock: IconType;
  export const FiPhone: IconType;
  export const FiAlertCircle: IconType;
  export const FiCalendar: IconType;
  export const FiMap: IconType;
  export const FiUsers: IconType;
  export const FiSettings: IconType;
  export const FiTag: IconType;
  export const FiDollarSign: IconType;
  export const FiClock: IconType;
  export const FiFacebook: IconType;
  export const FiTwitter: IconType;
  export const FiInstagram: IconType;
  export const FiLinkedin: IconType;
  export const FiDroplet: IconType;
  export const FiTruck: IconType;
  export const FiThumbsUp: IconType;
  export const FiCheckCircle: IconType;
  export const FiAward: IconType;
  export const FiArrowLeft: IconType;
  export const FiChevronRight: IconType;
  export const FiStar: IconType;
  export const FiMapPin: IconType;
  export const FiPhoneCall: IconType;
  export const FiFilter: IconType;
  export const FiPrinter: IconType;
  export const FiCheck: IconType;
}

declare module 'react-icons' {
  export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
  }
  
  export type IconType = (props: IconBaseProps) => JSX.Element;
} 