# JSON Extraction Simulator
https://github.com/user-attachments/assets/c7657ea7-a211-45ba-aa73-a444e8ee498f

A React application that demonstrates an AI Agent performing real-time extraction of fields from JSON data. The app provides two modes of operation:

1. **Simulation Mode**: Mimics an AI extracting fields from JSON with realistic typing effects, including random pauses and occasional typos.
2. **OpenAI Mode**: Uses the OpenAI API to perform actual field extraction from JSON data in real-time.

## Features

- Upload and parse JSON files
- Select specific fields to extract from the JSON via interactive checkboxes
- Toggle between simulated extraction and real OpenAI-powered extraction
- Realistic typing animation that mimics a human typing
- Syntax highlighting for JSON display
- Manual extraction trigger to control API usage
- User notifications for important events

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ai-in-pm/Real-time-Scratchpad.git
   cd Real-time-Scratchpad/json-extraction-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Upload a JSON file using the "Choose JSON File" button or use the default sample data
2. Select the fields you want to extract using the checkboxes
3. Choose between simulation mode or OpenAI extraction
4. If using OpenAI mode, click the "Extract Fields" button to trigger the extraction
5. Watch the extraction results appear in real-time with a typing effect

## Components

- **App**: Main application component that manages state and renders child components
- **FieldSelector**: Allows users to select which fields to extract from the JSON
- **ManualExtractor**: Handles manual extraction using the OpenAI API
- **AIExtractor**: Earlier implementation using React hooks (replaced by ManualExtractor)

## Technical Details

- Built with React and TypeScript
- Uses OpenAI API for real extraction capabilities
- Implements a realistic typing simulation with configurable parameters
- Uses React's state management for efficient updates

## License

MIT
