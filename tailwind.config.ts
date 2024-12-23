import flowbite from "flowbite-react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1536px'
  	},
  	fontFamily: {
  		body: [
  			'Poppins',
  			'ui-sans-serif',
  			'system-ui'
  		],
  		sans: [
  			'Poppins',
  			'ui-sans-serif',
  			'system-ui'
  		]
  	},
  	spacing: {
  		'0': '0',
  		'1': '0.25rem',
  		'2': '0.5rem',
  		'3': '0.75rem',
  		'4': '1rem',
  		'5': '1.25rem',
  		'6': '1.5rem',
  		'7': '1.75rem',
  		'8': '2rem',
  		'9': '2.25rem',
  		'10': '2.5rem',
  		'11': '2.75rem',
  		'12': '3rem',
  		'14': '3.5rem',
  		'16': '4rem',
  		'20': '5rem',
  		'24': '6rem',
  		'28': '7rem',
  		'32': '8rem',
  		'36': '9rem',
  		'40': '10rem',
  		'44': '11rem',
  		'48': '12rem',
  		'52': '13rem',
  		'56': '14rem',
  		'60': '15rem',
  		'64': '16rem',
  		'72': '18rem',
  		'80': '20rem',
  		'96': '24rem',
  		px: '1px',
  		'0.5': '0.125rem',
  		'1.5': '0.375rem',
  		'2.5': '0.625rem',
  		'3.5': '0.875rem'
  	},
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
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
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
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
  		backgroundImage: {
  			secondary: 'linear-gradient(to right, #fe4f70 0%, #ffa387 51%, #fe4f70 100%)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [flowbite.plugin(), require("tailwindcss-animate")],
};
export default config;
