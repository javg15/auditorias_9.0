// Automatically generated. Don't change this file manually.

import Archivos, { ArchivosInitializer, } from './archivos';
import Personal, { PersonalInitializer, } from './personal';
import Searchcampos, { SearchcamposInitializer, SearchcamposId } from './searchcampos';
import Searchoperador, { SearchoperadorInitializer, SearchoperadorId } from './searchoperador';
import Usuarios, { UsuariosInitializer, UsuariosId } from './usuarios';

type Model =
  | Archivos
  | Personal
  | Searchcampos
  | Searchoperador
  | Usuarios

interface ModelTypeMap {
  'archivos': Archivos;
  'personal': Personal;
  'searchcampos': Searchcampos;
  'searchoperador': Searchoperador;
  'usuarios': Usuarios;
}

type ModelId =
  | SearchcamposId
  | SearchoperadorId
  | UsuariosId

interface ModelIdTypeMap {
    'searchcampos': SearchcamposId;
  'searchoperador': SearchoperadorId;
    'usuarios': UsuariosId;
}

type Initializer =
  | ArchivosInitializer
  | PersonalInitializer
  | SearchcamposInitializer
  | SearchoperadorInitializer
  | UsuariosInitializer

interface InitializerTypeMap {
  'archivos': ArchivosInitializer;
  'personal': PersonalInitializer;
  'searchcampos': SearchcamposInitializer;
  'searchoperador': SearchoperadorInitializer;
  'usuarios': UsuariosInitializer;
}

export {
  Archivos, ArchivosInitializer,

  Personal, PersonalInitializer,
  Searchcampos, SearchcamposInitializer, SearchcamposId,
  Searchoperador, SearchoperadorInitializer, SearchoperadorId,
  Usuarios, UsuariosInitializer, UsuariosId,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
