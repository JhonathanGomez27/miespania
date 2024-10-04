/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthUtils } from 'app/core/auth/auth.utils';


export const token = AuthUtils._decodeToken(localStorage.getItem('accessToken'));

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'info-profile',
        title: 'Perfil',
        type : 'basic',
        icon : 'mat_outline:account_circle',
        // hidden: (item: FuseNavigationItem) => token?.rol != 'admin' ? false : true,
        link : '/info-profile',
        roles: ['user', 'admin']
    },
    {
        id   : 'torneos',
        title: 'Torneos',
        type : 'basic',
        icon : 'mat_outline:emoji_events',
        link : '/torneos',
        roles: ['user', 'admin']
    },{
        id      : 'jugadores',
        title   : 'Jugadores',
        type    : 'collapsable',
        icon    : 'heroicons_outline:user-group',
        link    : '',
        // hidden: (item: FuseNavigationItem) => token?.rol == 'admin' ? false : true,
        roles: ['admin'],
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
