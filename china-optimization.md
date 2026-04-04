# China DNS Optimization Guide

## 1. Use China-Friendly DNS
For users in China, recommend these DNS servers:
- 阿里DNS: 223.5.5.5, 223.6.6.6
- 腾讯DNS: 119.29.29.29, 182.254.116.116
- 百度DNS: 180.76.76.76

## 2. Test from China
Use these tools to test China connectivity:
- https://www.17ce.com/ (17CE - China monitoring)
- https://www.webpagetest.org/ (test from China locations)
- https://gtmetrix.com/ (Hong Kong test location)

## 3. Cloudflare China Network
Cloudflare has these China locations:
- Beijing
- Shanghai
- Guangzhou
- Chengdu
- Wuhan
- Hangzhou
- Nanjing
- Chongqing
- Tianjin
- Shenzhen

Make sure "Network Edge Locations" includes China.

## 4. China Performance Tips
- Minimize external API calls
- Use Chinese CDNs for external resources
- Optimize images for slower connections
- Enable compression
- Reduce bundle sizes
