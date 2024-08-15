import type { BaseModel, BaseMsg } from './update'
import { UpdateModelCommandOption } from './update-model-cmd'
import { Effect } from 'effect'

//
// PROCESS
//

export type ProcessMsg<UserMsg extends BaseMsg, UserModel extends BaseModel> = (
  msg: UserMsg
) => (m: UserModel) => UpdateModelCommandOption<UserModel>

export type ProcessUpdateModelReturn<UserModel extends BaseModel> =
  Effect.Effect<UpdateModelCommandOption<UserModel>>

export type ProcessUpdateModel<
  UserMsg extends BaseMsg,
  UserModel extends BaseModel,
> = (msg: UserMsg) => (m: UserModel) => ProcessUpdateModelReturn<UserModel>

export const processUpdateModelCommand = <UserModel extends BaseModel>(
  umcmd: UpdateModelCommandOption<UserModel>
): ProcessUpdateModelReturn<UserModel> => Effect.succeed(umcmd)
