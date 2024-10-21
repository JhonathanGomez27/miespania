/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';


export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'info-profile',
        title: 'Perfil',
        type : 'basic',
        icon : 'mat_outline:account_circle',
        link : '/info-profile',
        roles: ['user', 'admin']
    },
    {
        id   : 'info-statistics',
        title: 'Estadisticas',
        type : 'basic',
        icon : 'mat_outline:insights',
        link : '/info-statistics',
        // roles: ['user', 'admin']
        roles: ['user']
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
