/*
 * © 2023 Broadcom Inc and/or its subsidiaries; All rights reserved
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Broadcom, Inc. - initial API and implementation
 */

import { BearerTokenCredential, Credential } from './Credential';

export type ServiceProtocol = 'http' | 'https';
export const enum ServiceBasePath {
  LEGACY = '/EndevorService/rest',
  V1 = '/EndevorService/api/v1',
  V2 = '/EndevorService/api/v2',
}
export type ServiceLocation = Readonly<{
  protocol: ServiceProtocol;
  port: number;
  hostname: string;
  basePath: string;
}>;

export const enum ServiceApiVersion {
  V1 = 'v1',
  V2 = 'v2',
}
export type Service = Readonly<{
  location: ServiceLocation;
  credential: Credential;
  rejectUnauthorized: boolean;
}>;

export type Value = string;
export type StageNumber = '1' | '2';

export type Configuration = Readonly<{
  name: string;
  description: string;
}>;

export type ChangeControlValue = Readonly<{
  ccid: Value;
  comment: Value;
}>;
export type ActionChangeControlValue = ChangeControlValue;

export type EnvironmentStageMapPath = Readonly<{
  environment: Value;
  stageNumber: StageNumber;
}>;

export type IntermediateEnvironmentStage = EnvironmentStageMapPath &
  Readonly<{
    nextEnvironment: Value;
    nextStageNumber: StageNumber;
  }>;

export type LastEnvironmentStage = EnvironmentStageMapPath;

export type EnvironmentStage =
  | IntermediateEnvironmentStage
  | LastEnvironmentStage;

export type LastEnvironmentStageResponseObject = Readonly<{
  environment: Value;
  stageNumber: StageNumber;
  stageId: Value;
}>;

export type IntermediateEnvironmentStageResponseObject =
  LastEnvironmentStageResponseObject &
    Readonly<{
      nextEnvironment: Value;
      nextStageNumber: StageNumber;
    }>;

export type EnvironmentStageResponseObject =
  | IntermediateEnvironmentStageResponseObject
  | LastEnvironmentStageResponseObject;

export type SystemMapPath = EnvironmentStageMapPath &
  Readonly<{
    system: Value;
  }>;

export type System = SystemMapPath & {
  nextSystem: Value;
};

export type SystemResponseObject = Readonly<{
  environment: Value;
  stageId: Value;
  system: Value;
  nextSystem: Value;
}>;

export type SubSystemMapPath = SystemMapPath &
  Readonly<{
    subSystem: Value;
  }>;

export type SubSystem = SubSystemMapPath &
  Readonly<{
    nextSubSystem: Value;
  }>;

export type ElementTypeMapPath = SystemMapPath & {
  type: Value;
};

export type ElementType = ElementTypeMapPath &
  Readonly<{
    nextType: Value;
  }>;

export type ElementTypeResponseObject = Readonly<{
  environment: Value;
  stageId: Value;
  system: Value;
  type: Value;
  nextType: Value;
}>;

export type SubSystemResponseObject = Readonly<{
  environment: Value;
  stageId: Value;
  system: Value;
  subSystem: Value;
  nextSubSystem: Value;
}>;

export type ElementMapPath = SubSystemMapPath &
  Readonly<{
    type: Value;
    id: Value;
  }>;

export type Component = ElementMapPath;

export type Element = ElementMapPath &
  Readonly<{
    name: Value;
    noSource: boolean;
  }> &
  Partial<
    Readonly<{
      lastActionCcid: Value;
      extension: Value;
    }>
  >;
export type ElementContent = string;

export type Dependency = Element;

export type ElementData = Readonly<{
  content: ElementContent;
  // TODO temporary add element file path
  elementFilePath?: Value;
}>;

export type ElementDataWithFingerprint = ElementData &
  Readonly<{
    fingerprint: Value;
  }>;

export type AuthorizationToken = Readonly<{
  token: Value;
  tokenCreatedOn: Value;
  tokenValidFor: Value;
}>;

export type GenerateParams = Readonly<{
  copyBack: boolean;
  noSource: boolean;
  overrideSignOut: boolean;
}>;
export type GenerateWithCopyBackParams = Readonly<{ noSource?: boolean }>;
export type GenerateSignOutParams = Readonly<{
  overrideSignOut?: boolean;
}>;

export type OverrideSignOut = boolean;

export type SignOutParams = Readonly<{
  signoutChangeControlValue: ActionChangeControlValue;
  overrideSignOut?: OverrideSignOut;
}>;

export const enum SearchStrategies {
  IN_PLACE = 'IN_PLACE',
  FIRST_FOUND = 'FIRST_FOUND',
  ALL = 'ALL',
}

export const enum RetrieveSearchStrategies {
  IN_PLACE = 'IN_PLACE',
  FIRST_FOUND = 'FIRST_FOUND',
}

export const enum PrintActionTypes {
  BROWSE = 'BROWSE',
  HISTORY = 'HISTORY',
  LISTING = 'LISTING',
}

export const enum ResponseStatus {
  OK = 'OK',
  ERROR = 'ERROR',
}

export const enum ErrorResponseType {
  GENERIC_ERROR = 'GENERIC_ERROR',

  // errors thrown by Endevor rest api client
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  CERT_VALIDATION_ERROR = 'CERT_VALIDATION_ERROR',
  // exception: 401 - unauthorized http status
  UNAUTHORIZED_REQUEST_ERROR = 'UNAUTHORIZED_REQUEST_ERROR',

  // errors parsed out of Endevor message codes (usually returned with 4xx http status codes)
  SIGN_OUT_ENDEVOR_ERROR = 'SIGN_OUT_ENDEVOR_ERROR',
  FINGERPRINT_MISMATCH_ENDEVOR_ERROR = 'FINGERPRINT_MISMATCH_ENDEVOR_ERROR',
  DUPLICATE_ELEMENT_ENDEVOR_ERROR = 'DUPLICATE_ELEMENT_ENDEVOR_ERROR',
  PROCESSOR_STEP_MAX_RC_EXCEEDED_ENDEVOR_ERROR = 'PROCESSOR_STEP_MAX_RC_EXCEEDED_ENDEVOR_ERROR',
  NO_COMPONENT_INFO_ENDEVOR_ERROR = 'NO_COMPONENT_INFO_ENDEVOR_ERROR',
  WRONG_CREDENTIALS_ENDEVOR_ERROR = 'WRONG_CREDENTIALS_ENDEVOR_ERROR',
  // TODO: should be a warning message
  CHANGE_REGRESSION_ENDEVOR_ERROR = 'CHANGE_REGRESSION_ENDEVOR_ERROR',
}

export type EndevorReportIds = Readonly<{
  executionReportId: string;
}>;

// comes from successfully parsed Endevor errors
export type EndevorResponseDetails = Readonly<{
  returnCode: number;
}> &
  Partial<{
    // TODO: make non-partial when values become available
    reasonCode: number;
    apiVersion: ServiceApiVersion;
    reportIds: EndevorReportIds;
  }>;

// comes from Endevor rest client errors
export type ErrorDetails = Readonly<{
  httpStatusCode: number;
  connectionCode: string;
}>;

export type SuccessEndevorResponse<R = undefined> = {
  status: ResponseStatus.OK;
} & (R extends undefined
  ? Record<never, never>
  : {
      result: R;
    }) &
  // may or may not include the details
  Partial<{
    details: Readonly<{
      messages: ReadonlyArray<string>;
    }> &
      // details may be taken from Endevor error responses
      Partial<EndevorResponseDetails> &
      // successful Endevor responses are always provided with details
      EndevorResponseDetails;
  }>;

export type ErrorEndevorResponse<
  E extends ErrorResponseType | undefined = undefined
> = Readonly<{
  status: ResponseStatus.ERROR;
  type:
    | (E extends undefined ? never : E)
    // may appear on all the Endevor request types
    | ErrorResponseType.CERT_VALIDATION_ERROR
    | ErrorResponseType.CONNECTION_ERROR
    | ErrorResponseType.GENERIC_ERROR;
  details: Readonly<{
    messages: ReadonlyArray<string>;
  }> &
    // details may be taken from Endevor error responses
    Partial<EndevorResponseDetails> &
    // or from Endevor client errors
    Partial<ErrorDetails>;
}>;

export type ErrorEndevorAuthorizedResponse<
  E extends ErrorResponseType | undefined = undefined
> = Readonly<{
  status: ResponseStatus.ERROR;
  type:
    | (E extends undefined ? never : E)
    // may appear on all the Endevor authorized request types
    | ErrorResponseType.WRONG_CREDENTIALS_ENDEVOR_ERROR
    | ErrorResponseType.UNAUTHORIZED_REQUEST_ERROR
    | ErrorResponseType.CERT_VALIDATION_ERROR
    | ErrorResponseType.CONNECTION_ERROR
    | ErrorResponseType.GENERIC_ERROR;
  details: Readonly<{
    messages: ReadonlyArray<string>;
  }> &
    // may be included from Endevor errors responses
    Partial<EndevorResponseDetails> &
    // or from Endevor client errors
    Partial<ErrorDetails>;
}>;

export type EndevorResponse<
  E extends ErrorResponseType | undefined = undefined,
  R = undefined
> = SuccessEndevorResponse<R> | ErrorEndevorResponse<E>;

export type AuthorizedEndevorResponse<
  E extends ErrorResponseType | undefined = undefined,
  R = undefined
> = SuccessEndevorResponse<R> | ErrorEndevorAuthorizedResponse<E>;

export type ApiVersionResponse = EndevorResponse<undefined, ServiceApiVersion>;

export type ConfigurationsResponse = EndevorResponse<
  undefined,
  ReadonlyArray<Configuration>
>;

export type AuthenticationTokenResponse = AuthorizedEndevorResponse<
  undefined,
  BearerTokenCredential | null
>;

export type SignInElementResponse = AuthorizedEndevorResponse;

export type SignoutElementResponse =
  AuthorizedEndevorResponse<ErrorResponseType.SIGN_OUT_ENDEVOR_ERROR>;

export type RetrieveElementWithSignoutResponse = AuthorizedEndevorResponse<
  ErrorResponseType.SIGN_OUT_ENDEVOR_ERROR,
  ElementDataWithFingerprint
>;

export type RetrieveElementWithoutSignoutResponse = AuthorizedEndevorResponse<
  undefined,
  ElementDataWithFingerprint
>;

export type EnvironmentStagesResponse = AuthorizedEndevorResponse<
  undefined,
  ReadonlyArray<EnvironmentStageResponseObject>
>;

export type SystemsResponse = AuthorizedEndevorResponse<
  undefined,
  ReadonlyArray<SystemResponseObject>
>;

export type SubSystemsResponse = AuthorizedEndevorResponse<
  undefined,
  ReadonlyArray<SubSystemResponseObject>
>;

export type ElementTypesResponse = AuthorizedEndevorResponse<
  undefined,
  ReadonlyArray<ElementTypeResponseObject>
>;

export type ElementsResponse = AuthorizedEndevorResponse<
  undefined,
  ReadonlyArray<Element>
>;

export type ComponentsResponse = AuthorizedEndevorResponse<
  undefined,
  ReadonlyArray<Component>
>;

export type GenerateResponse = AuthorizedEndevorResponse<
  | ErrorResponseType.PROCESSOR_STEP_MAX_RC_EXCEEDED_ENDEVOR_ERROR
  | ErrorResponseType.SIGN_OUT_ENDEVOR_ERROR
>;

export type AddResponse =
  AuthorizedEndevorResponse<ErrorResponseType.DUPLICATE_ELEMENT_ENDEVOR_ERROR>;

export type UpdateResponse = AuthorizedEndevorResponse<
  | ErrorResponseType.FINGERPRINT_MISMATCH_ENDEVOR_ERROR
  | ErrorResponseType.SIGN_OUT_ENDEVOR_ERROR
>;

export type PrintResponse = AuthorizedEndevorResponse<
  ErrorResponseType.NO_COMPONENT_INFO_ENDEVOR_ERROR,
  string
>;
