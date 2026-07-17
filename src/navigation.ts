import {ComponentProps} from 'react';
import {createNavigation} from 'next-intl/navigation';
import {routing} from './config';

export const {Link, getPathname, redirect, usePathname, useRouter} =
  createNavigation(routing);

// A href accepted by the typed <Link>: one of the declared pathnames, or an
// object form ({pathname, hash, params...}) for anchors and dynamic routes.
export type AppHref = ComponentProps<typeof Link>['href'];
