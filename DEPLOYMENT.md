# Deployment

## Current release

- Provider: Tencent Cloud EdgeOne Makers
- Project: `win-portfolio`
- Project ID: `makers-he4x3yqu2eiq`
- Deployment ID: `dps9xhzxjpvt`
- Deployment status: successful
- Temporary domain: `https://win-portfolio-1qrkavew.edgeone.cool`
- Acceleration area: global, excluding Chinese mainland

## Custom domain

- Domain: `winux.online`
- Registrar / DNS: Tencent Cloud DNSPod
- Registration status: active
- Nameservers: `long.dnspod.net`, `isaac.dnspod.net`

## Remaining console steps

1. Open the EdgeOne Makers project and enter Domain Management.
2. Add `winux.online` as the production custom domain.
3. Add the ownership-verification record shown by EdgeOne in DNSPod.
4. Add the CNAME record shown by EdgeOne in DNSPod.
5. Enable a free HTTPS certificate with automatic validation.
6. Verify `https://winux.online` from both desktop and mobile networks.

The site build and upload are complete. The remaining steps require the signed-in Tencent Cloud console because EdgeOne CLI does not expose custom-domain management.
