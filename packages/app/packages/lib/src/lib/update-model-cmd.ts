import type { BaseModel, Cmd } from './update'
import { Effect, Option } from 'effect'

//
// UPDATE MODEL
//

type Model<UserModel extends BaseModel> = Effect.Effect<UserModel>

export type UpdateModel<UserModel extends BaseModel> = (
  m: UserModel
) => Model<UserModel>

export const emptyUpdateModel = <UserModel extends BaseModel>(): Option.Option<
  UpdateModel<UserModel>
> => Option.none()

export const emptyCmd = (): Cmd => syncCmd(() => {})

export const syncCmd = (x: () => void) => Effect.sync(x)

//
// UPDATE MODEL + COMMAND
//

type Struct<A, B> = {
  updateModel: A
  cmd: B
}

export type UpdateModelCommand<UserModel extends BaseModel> = Struct<
  UpdateModel<UserModel>,
  Cmd
>

export type UpdateModelCommandOption<UserModel extends BaseModel> = Struct<
  Option.Option<UpdateModel<UserModel>>,
  Cmd
>

export const empty = <
  UserModel extends BaseModel,
>(): UpdateModelCommandOption<UserModel> => ({
  updateModel: emptyUpdateModel(),
  cmd: emptyCmd(),
})

export const updateModel = <UserModel extends BaseModel>(
  um: UpdateModel<UserModel>
): UpdateModelCommandOption<UserModel> => ({
  updateModel: Option.some(um),
  cmd: emptyCmd(),
})

export const command = <UserModel extends BaseModel>(
  cmd: Cmd
): UpdateModelCommandOption<UserModel> => ({
  updateModel: emptyUpdateModel(),
  cmd,
})

export const both = <UserModel extends BaseModel>(
  um: UpdateModel<UserModel>,
  cmd: Cmd
): UpdateModelCommandOption<UserModel> => ({
  updateModel: Option.some(um),
  cmd,
})
