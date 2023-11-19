/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
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
