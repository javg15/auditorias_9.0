export const navItems = [
  {"name":"Inicio","url":"/home"},
  /*{
    title: true,
    name: 'Theme'
  },*/
  {
    name: 'Auditorías',
    url: '/auditorias',
    icon: 'icon-puzzle',
  },
  {
    name: 'Catalogos',
    url: '/catalogos',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Ejercicios',
        url: '/catalogos/ejercicios',
        
      },
      {
        name: 'Entidades',
        url: '/catalogos/entidades',
        
      },
      {
        name: 'Responsables',
        url: '/catalogos/responsables',
        
      },
      {
        name: 'Servidores',
        url: '/catalogos/servidores',
        
      },
      {
        name: 'Tipos de auditoría',
        url: '/catalogos/tiposauditoria',
        
      },
    ]
  },
  {
    name: 'Portabilidad',
    url: '/portabilidad',
    icon: 'icon-puzzle',
  },
];
