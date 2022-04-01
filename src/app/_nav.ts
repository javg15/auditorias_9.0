export const navItems = [
  {"name":"Inicio","url":"/home"},
  /*{
    title: true,
    name: 'Theme'
  },*/
  /*{
    name: 'Prueba',
    url: '/prueba',
    icon: 'icon-drop'
  },*/
  {
    name: 'Catalogos',
    url: '/catalogos',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Ejercicios',
        url: '/catalogos/ejercicios',
        icon: 'icon-puzzle'
      },
      {
        name: 'Entidades',
        url: '/catalogos/entidades',
        icon: 'icon-puzzle'
      },
      {
        name: 'Responsables',
        url: '/catalogos/responsables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Servidores',
        url: '/catalogos/servidores',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tipos de auditoría',
        url: '/catalogos/tiposauditoria',
        icon: 'icon-puzzle'
      },
    ]
  },
  {
    divider: true
  },
  
];
