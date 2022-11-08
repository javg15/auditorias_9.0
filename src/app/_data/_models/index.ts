// Automatically generated. Don't change this file manually.

import Personal, { PersonalInitializer, } from './personal';
import Searchcampos, { SearchcamposInitializer, SearchcamposId } from './searchcampos';
import Searchoperador, { SearchoperadorInitializer, SearchoperadorId } from './searchoperador';

type Model =
  | Personal
  | Searchcampos
  | Searchoperador

interface ModelTypeMap {
  'personal': Personal;
  'searchcampos': Searchcampos;
  'searchoperador': Searchoperador;
}

type ModelId =
  | SearchcamposId
  | SearchoperadorId

interface ModelIdTypeMap {
    'searchcampos': SearchcamposId;
  'searchoperador': SearchoperadorId;
}

type Initializer =
  | PersonalInitializer
  | SearchcamposInitializer
  | SearchoperadorInitializer

interface InitializerTypeMap {
  'personal': PersonalInitializer;
  'searchcampos': SearchcamposInitializer;
  'searchoperador': SearchoperadorInitializer;
}

export {

  Personal, PersonalInitializer,
  Searchcampos, SearchcamposInitializer, SearchcamposId,
  Searchoperador, SearchoperadorInitializer, SearchoperadorId,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
