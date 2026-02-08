/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				main: '#2d5f5f',
  				dark: '#1a4d4d',
  				light: '#3d7373'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  				peach: '#f4cdb8',
  				blush: '#f5ddd1',
  				sage: '#a8b5a8',
  				mint: '#c5d5d0'
  			},
  			botanical: {
  				green: '#4a6b5b',
  				dark: '#2d4a3d',
  				leaf: '#5a7d6b',
  				stem: '#3d564a'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			display: ['Playfair Display', 'Georgia', 'serif'],
  			sans: ['Inter', 'system-ui', 'sans-serif']

  		},
		fontSize: {
			'sm': ['0.875rem', { lineHeight: '1.25rem' }],
			'base': ['1rem', { lineHeight: '1.5rem' }]
		},
		fontWeight: {
			'normal': '400',
			'medium': '500',
			'semibold': '600',
			'bold': '900'
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			organic: '40% 60% 50% 50% / 60% 40% 60% 40%'
  		},
  		boxShadow: {
  			soft: '0 4px 20px rgba(45, 95, 95, 0.08)'
  		},
  		animation: {
  			'fade-in-up': 'fadeInUp 0.5s ease-out',
  			'slide-in': 'slideIn 0.3s ease-out',
  			'float': 'float 6s ease-in-out infinite'
  		},
  		keyframes: {
  			fadeInUp: {
  				'0%': { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			slideIn: {
  				'0%': { opacity: '0', transform: 'translateX(-20px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' }
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-20px)' }
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
