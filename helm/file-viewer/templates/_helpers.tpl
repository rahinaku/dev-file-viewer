{{/*
Expand the name of the chart.
*/}}
{{- define "file-viewer.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "file-viewer.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "file-viewer.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "file-viewer.labels" -}}
helm.sh/chart: {{ include "file-viewer.chart" . }}
{{ include "file-viewer.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "file-viewer.selectorLabels" -}}
app.kubernetes.io/name: {{ include "file-viewer.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "file-viewer.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "file-viewer.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
PV name
*/}}
{{- define "file-viewer.pvName" -}}
{{- if .Values.persistence.pv.name }}
{{- .Values.persistence.pv.name }}
{{- else }}
{{- include "file-viewer.fullname" . }}-pv
{{- end }}
{{- end }}

{{/*
PVC name
*/}}
{{- define "file-viewer.pvcName" -}}
{{- if .Values.persistence.existingClaim }}
{{- .Values.persistence.existingClaim }}
{{- else if .Values.persistence.pvc.name }}
{{- .Values.persistence.pvc.name }}
{{- else }}
{{- include "file-viewer.fullname" . }}-pvc
{{- end }}
{{- end }}