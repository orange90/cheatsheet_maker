# Cheatsheet Maker

An AI-powered tool that converts PDF documents or web links into beautiful, formatted cheatsheets with translation support.

## Features

- 📄 **PDF Upload**: Upload PDF files to extract content
- 🔗 **Web Link**: Input URLs to process web content
- 🤖 **AI Processing**: Uses SiliconFlow's DeepSeek API for intelligent content extraction
- 🌍 **Translation**: Support for Chinese and English translation
- 🎨 **Modern Design**: Beautiful card-based layout with Tailwind CSS
- 📱 **Responsive**: Works on desktop and mobile devices
- 🖼️ **PNG Export**: Export cheatsheets as high-quality PNG images
- ⚡ **Fast**: Built with React, TypeScript, and Vite

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI Integration**: SiliconFlow API (DeepSeek)
- **Export**: html2canvas for PNG generation
- **PDF Processing**: pdf.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/orange90/cheatsheet_maker.git
cd cheatsheet_maker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SILICONFLOW_API_URL=https://api.siliconflow.cn/v1/chat/completions
VITE_SILICONFLOW_API_TOKEN=your_api_token_here
VITE_AI_MODEL=moonshotai/Kimi-K2-Thinking
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Upload Content**: 
   - Upload a PDF file using drag & drop or file selection
   - Or enter a web URL to process online content

2. **Process with AI**: 
   - Click "Generate Cheatsheet" to extract key points
   - Use "Translate" to switch between Chinese and English

3. **Customize**: 
   - Edit individual cards by clicking the edit button
   - Add new cards or delete existing ones
   - Cards automatically get beautiful gradient colors

4. **Export**: 
   - Choose between Desktop (1920×1080) or Mobile (1080×1920) format
   - Click "Export as PNG" to download your cheatsheet

## API Configuration

This project uses SiliconFlow's API for AI processing. You need to:

1. Sign up at [SiliconFlow](https://cloud.siliconflow.cn/)
2. Get your API token from the dashboard
3. Add it to your `.env` file

## Deployment

The project is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Page components
├── services/           # API and utility services
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
