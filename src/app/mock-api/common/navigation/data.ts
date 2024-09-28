/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthUtils } from 'app/core/auth/auth.utils';


export const token = AuthUtils._decodeToken(localStorage.getItem('accessToken'));

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'info-profile',
        title: 'Profile',
        type : 'basic',
        icon : 'mat_outline:account_circle',
        link : '/info-profile'
    },
    {
        id   : 'torneos',
        title: 'Torneos',
        type : 'basic',
        icon : 'mat_outline:emoji_events',
        link : '/torneos'
    },{
        id      : 'jugadores',
        title   : 'Jugadores',
        type    : 'collapsable',
        icon    : 'heroicons_outline:user-group',
        link    : '',
        hidden: (item: FuseNavigationItem) => token?.rol == 'admin' ? false : true,
        children: [
            {
                id   : 'singles',
                title: 'Singles',
                type : 'basic',
                link : '/jugadores/solos'
            },
            {
                id   : 'parejas',
                title: 'Parejas',
                type : 'basic',
                link : '/jugadores/parejas'
            },
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
