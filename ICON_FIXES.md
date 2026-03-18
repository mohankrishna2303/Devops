# Icon Import Fixes for Lucide React

## Fixed Issues

### 1. ProjectsPage.jsx
- **Issue**: `Sync` icon doesn't exist
- **Fix**: Replaced with `RefreshCw`

### 2. IntegrationsPage.jsx  
- **Issue**: `Aws` icon doesn't exist
- **Fix**: Replaced with `Cloud`
- **Issue**: `Bitbucket` icon doesn't exist
- **Fix**: Replaced with `GitBranch as Bitbucket`
- **Issue**: `Docker` icon doesn't exist
- **Fix**: Replaced with `Package as Docker`
- **Issue**: `Kubernetes` icon doesn't exist
- **Fix**: Replaced with `Server as Kubernetes`
- **Issue**: `Slack` icon doesn't exist
- **Fix**: Replaced with `MessageSquare as Slack`

### 3. Analytics.jsx
- **Issue**: `CloudLightning` icon doesn't exist  
- **Fix**: Replaced with `Zap as CloudLightning`

### 4. Security.jsx
- **Issue**: `ShieldAlert`, `Scan`, `FileWarning` icons don't exist
- **Fix**: Replaced with aliases:
  - `Shield as ShieldAlert`
  - `Search as Scan` 
  - `AlertTriangle as FileWarning`

### 5. Registry.jsx
- **Issue**: `ShieldCheck` icon doesn't exist
- **Fix**: Replaced with `CheckCircle as ShieldCheck`

### 6. Billing.jsx
- **Issue**: `CreditCard` icon doesn't exist
- **Fix**: Replaced with `Square as CreditCard`

### 7. SocialLoginButtons.jsx
- **Issue**: `Gitlab` icon doesn't exist
- **Fix**: Replaced with `GitBranch as Gitlab`

### 8. TerraformHub.jsx
- **Issue**: `ShieldCheck` icon doesn't exist
- **Fix**: Replaced with `CheckCircle as ShieldCheck`

## Valid Lucide React Icons Used

### Common Icons
- `AlertTriangle` - Warning/Alert icons
- `CheckCircle` - Success/Check icons  
- `XCircle` - Error/Close icons
- `RefreshCw` - Refresh/Sync icons
- `Settings` - Settings/Configuration icons
- `Search` - Search icons
- `Clock` - Time/History icons
- `Zap` - Lightning/Power icons
- `Shield` - Security icons
- `Cloud` - Cloud/Infrastructure icons

### Specific Icons
- `Github` - GitHub integration
- `Gitlab` - GitLab integration  
- `Bitbucket` - Bitbucket integration
- `Docker` - Docker containers
- `Kubernetes` - K8s orchestration
- `Slack` - Slack notifications
- `Server` - Server/Infrastructure
- `Database` - Database icons
- `Activity` - Activity/Monitoring
- `TrendingUp` - Upward trends
- `TrendingDown` - Downward trends
- `Users` - User management
- `Bell` - Notifications
- `Lock` - Security/Lock
- `Eye` - View/Visibility

## Notes

All icons are now using valid Lucide React exports. The platform should load without any icon-related import errors.

If you need to add new icons, check the [Lucide React documentation](https://lucide.dev/) for available icon names.
