# 🇹🇭 Thailand-Inspired CSS Theme

## 🎨 Color Palette

### Thailand Flag Colors
- **Red**: `#A51942` - Thai flag red
- **White**: `#FFFFFF` - Thai flag white  
- **Blue**: `#2D3A7A` - Thai flag blue
- **Gold**: `#F5B800` - Thai royal gold

### Cultural Colors
- **Siam Orange**: `#FF6B35` - Historical Siam kingdom
- **Buddhist Gold**: `#FFD700` - Buddhist temples and gold
- **Lotus Pink**: `#FF69B4` - National flower
- **Temple Brown**: `#8B4513` - Temple architecture
- **Rice Green**: `#F5DEB3` - Rice paddies
- **Elephant Gray**: `#708090` - National animal

## 🛠️ Implementation

### Tailwind Config
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      thailand: {
        red: '#A51942',
        white: '#FFFFFF',  
        blue: '#2D3A7A',
        gold: '#F5B800',
        siam: '#FF6B35',
        buddha: '#FFD700',
        lotus: '#FF69B4',
        temple: '#8B4513',
        rice: '#F5DEB3',
        elephant: '#708090',
      }
    }
  }
}
```

### CSS Classes
```css
/* Primary buttons with Thailand colors */
.btn-primary {
  @apply bg-thailand-blue text-white px-4 py-2 rounded-lg hover:bg-thailand-red transition-colors;
}

/* Secondary buttons */
.btn-secondary {
  @apply bg-thailand-white text-thailand-elephant px-4 py-2 border border-thailand-gold rounded-lg hover:bg-thailand-rice transition-colors;
}

/* Cards with Thailand styling */
.card {
  @apply bg-thailand-white rounded-lg shadow-md border border-thailand-gold;
}

/* Sidebar navigation */
.sidebar-item {
  @apply flex items-center px-3 py-2 text-thailand-elephant hover:bg-thailand-temple hover:text-thailand-white rounded-lg transition-colors;
}

.sidebar-item-active {
  @apply flex items-center px-3 py-2 bg-thailand-red text-thailand-white rounded-lg;
}

/* Form inputs */
.input-field {
  @apply w-full px-3 py-2 border border-thailand-gold rounded-md focus:outline-none focus:ring-2 focus:ring-thailand-blue focus:border-transparent;
}

/* Status indicators */
.status-online {
  @apply inline-block w-2 h-2 bg-thailand-rice rounded-full;
}

.status-offline {
  @apply inline-block w-2 h-2 bg-thailand-red rounded-full;
}

.status-warning {
  @apply inline-block w-2 h-2 bg-thailand-gold rounded-full;
}
```

## 🌈 Thailand-Inspired Gradients

### Thailand Flag Gradient
```css
.gradient-thailand {
  background: linear-gradient(135deg, #A51942 0%, #2D3A7A 50%, #F5B800 100%);
}
```

### Buddhist Theme Gradient
```css
.gradient-buddhist {
  background: linear-gradient(135deg, #FFD700 0%, #FF69B4 50%, #8B4513 100%);
}
```

### Nature Gradient
```css
.gradient-nature {
  background: linear-gradient(135deg, #F5DEB3 0%, #708090 50%, #2D3A7A 100%);
}
```

## 🎯 Usage Examples

### Thailand-Themed Button
```jsx
<button className="btn-primary">
  🇹🇭 DevOps Platform
</button>
```

### Thailand-Themed Card
```jsx
<div className="card border-thailand-gold">
  <h3 className="text-thailand-blue">Thai DevOps</h3>
  <p className="text-thailand-elephant">Powered by Thailand</p>
</div>
```

### Thailand Gradient Background
```jsx
<div className="gradient-thailand p-6 rounded-lg">
  <h2 className="text-thailand-white text-2xl font-bold">สวัสดีครับ</h2>
  <p className="text-thailand-white">Welcome to your DevOps platform</p>
</div>
```

## 🚀 Features Applied

✅ **Custom Thailand color palette** in Tailwind config
✅ **Thailand-inspired component classes** 
✅ **Cultural color references** (flag, Buddhism, nature)
✅ **Gradient backgrounds** for visual appeal
✅ **Status indicators** with Thailand colors
✅ **Form styling** with Thai gold accents
✅ **Navigation styling** with temple colors

## 📱 Notes

- The `@apply` warnings in CSS are normal and expected when using Tailwind CSS
- All Thailand colors are available as `bg-thailand-red`, `text-thailand-blue`, etc.
- Theme reflects Thai culture and national symbols
- Colors work across all components and pages

Your DevOps platform now has a beautiful Thailand-inspired theme! 🇹🇭
