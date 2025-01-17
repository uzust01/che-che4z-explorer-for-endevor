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

import { withNotificationProgress } from '@local/vscode-wrapper/window';
import * as vscode from 'vscode';
import { downloadReportById } from '../endevor';
import { logger, reporter } from '../globals';
import { fromGenericReportUri } from '../uri/genericReportUri';
import { isError } from '../utils';
import {
  ReportContentProviderCompletedStatus,
  TelemetryEvents,
} from '../_doc/telemetry/v2/Telemetry';

export const endevorReportContentProvider: vscode.TextDocumentContentProvider =
  {
    async provideTextDocumentContent(
      uri: vscode.Uri,
      _token: vscode.CancellationToken
    ): Promise<string | undefined> {
      reporter.sendTelemetryEvent({
        type: TelemetryEvents.REPORT_CONTENT_PROVIDER_CALLED,
      });
      const uriParams = fromGenericReportUri(uri);
      if (isError(uriParams)) {
        const error = uriParams;
        logger.error(
          `Unable to print the Endevor report contents.`,
          `Unable to print the Endevor report contents because parsing of the reports URI failed with error:\n${error.message}.`
        );
        return;
      }
      const { service, reportId, configuration, objectName } = uriParams;
      const retrieveReport = await withNotificationProgress(
        `Retrieving Endevor report for ${objectName}`
      )((progressReporter) =>
        downloadReportById(progressReporter)(service)(configuration)(reportId)
      );
      if (!retrieveReport) {
        const error = new Error(
          `Unable to retrieve the Endevor report for ${objectName}`
        );
        logger.error(`${error.message}.`);
        reporter.sendTelemetryEvent({
          type: TelemetryEvents.ERROR,
          errorContext: TelemetryEvents.COMMAND_PRINT_ENDEVOR_REPORT_CALLED,
          status: ReportContentProviderCompletedStatus.GENERIC_ERROR,
          error,
        });
        return;
      }
      reporter.sendTelemetryEvent({
        type: TelemetryEvents.REPORT_CONTENT_PROVIDER_COMPLETED,
        context: TelemetryEvents.COMMAND_PRINT_ENDEVOR_REPORT_CALLED,
        status: ReportContentProviderCompletedStatus.SUCCESS,
      });
      return retrieveReport;
    },
  };

/**
 * {@link reportContentProvider} will be called by VSCode
 *
 * @returns document with report or empty content
 */
export const getEndevorReportContent = async (
  uri: vscode.Uri
): Promise<vscode.TextDocument> => {
  return await vscode.workspace.openTextDocument(uri);
};
