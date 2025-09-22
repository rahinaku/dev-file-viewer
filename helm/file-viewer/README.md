# File Viewer Helm Chart

A Helm chart for deploying the file-viewer application on Kubernetes.

## Prerequisites

- Kubernetes 1.18+
- Helm 3.0+
- Persistent Volume support (for file storage)

## Installation

1. Clone the repository and navigate to the helm directory:
```bash
cd helm/file-viewer
```

2. Install the chart:
```bash
helm install my-file-viewer . 
```

3. Or install with custom values:
```bash
helm install my-file-viewer . -f custom-values.yaml
```

## Configuration

The following table lists the configurable parameters and their default values:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Image repository | `file-viewer` |
| `image.tag` | Image tag | `latest` |
| `image.pullPolicy` | Image pull policy | `Never` |
| `securityContext.uid` | User ID for container | `1000` |
| `securityContext.gid` | Group ID for container | `1000` |
| `securityContext.user` | Username for container | `fileviewer` |
| `env.rootFolder` | Root folder path inside container | `/storage` |
| `service.type` | Service type | `LoadBalancer` |
| `service.port` | Service port | `3000` |
| `persistence.enabled` | Enable persistent storage | `true` |
| `persistence.pv.capacity` | PV capacity | `200Gi` |
| `persistence.pv.hostPath` | Host path to mount | `/mnt/usb-ssd/shere` |
| `persistence.pvc.resources.requests.storage` | PVC storage request | `190Gi` |
| `ingress.enabled` | Enable ingress | `false` |

## Usage Examples

### Basic Installation
```bash
helm install file-viewer ./helm/file-viewer
```

### With Custom Storage Path
```bash
helm install file-viewer ./helm/file-viewer \
  --set persistence.pv.hostPath=/your/storage/path
```

### With Ingress Enabled
```bash
helm install file-viewer ./helm/file-viewer \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=fileviewer.yourdomain.com
```

### Using Existing PVC
```bash
helm install file-viewer ./helm/file-viewer \
  --set persistence.create=false \
  --set persistence.existingClaim=your-existing-pvc
```

## Uninstallation

```bash
helm uninstall file-viewer
```

Note: This will not delete the PersistentVolume. You may need to clean it up manually if desired.

## Troubleshooting

1. Check pod logs:
```bash
kubectl logs -l app.kubernetes.io/name=file-viewer
```

2. Check persistent volume status:
```bash
kubectl get pv,pvc
```

3. Port forward for local access:
```bash
kubectl port-forward svc/file-viewer 3000:3000
```