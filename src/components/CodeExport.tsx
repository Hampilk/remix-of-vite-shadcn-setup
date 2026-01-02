import { useState, useMemo } from 'react';
import { ComponentInstance } from '@/types/componentInstance';
import { getComponentById } from '@/data/componentCatalog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Copy, 
  Download, 
  Code2, 
  FileCode, 
  Palette, 
  Braces,
  Check,
  FileJson,
  Settings2,
  Eye,
  Code,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ExportFormat = 'react' | 'html' | 'css' | 'tailwind' | 'vue' | 'svelte' | 'json';

interface CodeExportProps {
  instances: ComponentInstance[];
}

interface ExportSettings {
  useSemicolons: boolean;
  useSingleQuotes: boolean;
  indentSize: 2 | 4;
  includeComments: boolean;
  minifyOutput: boolean;
  includeImports: boolean;
  useTypeScript: boolean;
}

const formatConfig: { 
  id: ExportFormat; 
  label: string; 
  icon: React.ElementType; 
  extension: string;
  color: string;
}[] = [
  { id: 'react', label: 'React', icon: Code2, extension: 'tsx', color: 'text-cyan-400' },
  { id: 'html', label: 'HTML', icon: FileCode, extension: 'html', color: 'text-orange-400' },
  { id: 'css', label: 'CSS', icon: Palette, extension: 'css', color: 'text-blue-400' },
  { id: 'tailwind', label: 'Tailwind', icon: Braces, extension: 'tsx', color: 'text-teal-400' },
  { id: 'vue', label: 'Vue', icon: Code, extension: 'vue', color: 'text-green-400' },
  { id: 'svelte', label: 'Svelte', icon: Sparkles, extension: 'svelte', color: 'text-red-400' },
  { id: 'json', label: 'JSON', icon: FileJson, extension: 'json', color: 'text-yellow-400' },
];

// Syntax highlighting helper
const highlightCode = (code: string, format: ExportFormat): React.ReactNode => {
  const lines = code.split('\n');
  
  return lines.map((line, i) => {
    let highlightedLine = line;
    
    // Simple syntax highlighting
    highlightedLine = highlightedLine
      .replace(/(['"])(.*?)\1/g, '<span class="text-green-400">$&</span>') // Strings
      .replace(/\b(const|let|var|function|return|import|export|from|default|class|extends|if|else|for|while|switch|case|break|continue)\b/g, '<span class="text-purple-400">$&</span>') // Keywords
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$&</span>') // Booleans
      .replace(/\b(\d+)\b/g, '<span class="text-blue-400">$&</span>') // Numbers
      .replace(/(\/\/.*$)/g, '<span class="text-zinc-500">$&</span>') // Comments
      .replace(/(&lt;\/?\w+)/g, '<span class="text-pink-400">$&</span>'); // Tags
    
    return (
      <div key={i} className="table-row">
        <span className="table-cell pr-4 text-right select-none text-zinc-600 w-12">
          {i + 1}
        </span>
        <span 
          className="table-cell pl-4"
          dangerouslySetInnerHTML={{ __html: highlightedLine || '&nbsp;' }}
        />
      </div>
    );
  });
};

// Generate React/JSX code
const generateReactCode = (
  instances: ComponentInstance[], 
  settings: ExportSettings
): string => {
  const quote = settings.useSingleQuotes ? "'" : '"';
  const semi = settings.useSemicolons ? ';' : '';
  const indent = ' '.repeat(settings.indentSize);
  const fileExt = settings.useTypeScript ? 'tsx' : 'jsx';

  if (instances.length === 0) {
    return `${settings.includeComments ? '// No components on canvas\n' : ''}import React from ${quote}react${quote}${semi}

export const MyComponent${settings.useTypeScript ? ': React.FC' : ''} = () => {
${indent}return (
${indent}${indent}<div className=${quote}relative w-full min-h-[500px] p-4${quote}>
${indent}${indent}${indent}{/* Add components to the canvas to generate code */}
${indent}${indent}</div>
${indent})${semi}
}${semi}`;
  }

  const imports = new Set<string>();
  const componentJSX: string[] = [];

  instances.forEach(instance => {
    const comp = getComponentById(instance.componentId);
    if (!comp) return;

    const componentName = comp.name.replace(/\s+/g, '');
    if (settings.includeImports) {
      imports.add(`import { ${componentName} } from ${quote}@/components/ui/${comp.id}${quote}${semi}`);
    }

    const props = instance.props;
    const propsStr = Object.entries(props)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? key : `${key}={false}`;
        }
        if (typeof value === 'number') {
          return `${key}={${value}}`;
        }
        return `${key}=${quote}${value}${quote}`;
      })
      .join(' ');

    const style = `style={{ position: ${quote}absolute${quote}, left: ${quote}${instance.position.x}px${quote}, top: ${quote}${instance.position.y}px${quote} }}`;
    
    switch (instance.componentId) {
      case 'button':
        componentJSX.push(`${indent}${indent}<Button ${propsStr} ${style}>${props.text || 'Button'}</Button>`);
        break;
      case 'input':
        componentJSX.push(`${indent}${indent}<Input ${propsStr} ${style} />`);
        break;
      case 'badge':
        componentJSX.push(`${indent}${indent}<Badge ${propsStr} ${style}>${props.text || 'Badge'}</Badge>`);
        break;
      case 'card':
        componentJSX.push(`${indent}${indent}<Card ${style}>
${indent}${indent}${indent}<CardHeader>
${indent}${indent}${indent}${indent}<CardTitle>${props.text || 'Card Title'}</CardTitle>
${indent}${indent}${indent}</CardHeader>
${indent}${indent}${indent}<CardContent>
${indent}${indent}${indent}${indent}<p>Card content</p>
${indent}${indent}${indent}</CardContent>
${indent}${indent}</Card>`);
        break;
      default:
        if (settings.includeComments) {
          componentJSX.push(`${indent}${indent}{/* ${comp.name} */}`);
        }
    }
  });

  const importsStr = settings.includeImports && imports.size > 0 
    ? `${Array.from(imports).join('\n')}\n\n` 
    : '';

  return `${settings.includeComments ? '// Generated component code\n' : ''}import React from ${quote}react${quote}${semi}
${importsStr}export const MyComponent${settings.useTypeScript ? ': React.FC' : ''} = () => {
${indent}return (
${indent}${indent}<div className=${quote}relative w-full min-h-[500px]${quote}>
${componentJSX.join('\n')}
${indent}${indent}</div>
${indent})${semi}
}${semi}`;
};

// Generate Vue code
const generateVueCode = (instances: ComponentInstance[], settings: ExportSettings): string => {
  if (instances.length === 0) {
    return `<template>
  <div class="relative w-full min-h-[500px]">
    <!-- Add components to generate code -->
  </div>
</template>

<script setup${settings.useTypeScript ? ' lang="ts"' : ''}>
// Component logic here
</script>

<style scoped>
/* Component styles */
</style>`;
  }

  const elements: string[] = [];

  instances.forEach(instance => {
    const comp = getComponentById(instance.componentId);
    if (!comp) return;

    const style = `style="position: absolute; left: ${instance.position.x}px; top: ${instance.position.y}px"`;
    
    switch (instance.componentId) {
      case 'button':
        elements.push(`    <button ${style} class="btn">${instance.props.text || 'Button'}</button>`);
        break;
      case 'input':
        elements.push(`    <input ${style} type="text" class="input" placeholder="${instance.props.text || 'Enter text...'}" />`);
        break;
      default:
        if (settings.includeComments) {
          elements.push(`    <!-- ${comp.name} -->`);
        }
    }
  });

  return `<template>
  <div class="relative w-full min-h-[500px]">
${elements.join('\n')}
  </div>
</template>

<script setup${settings.useTypeScript ? ' lang="ts"' : ''}>
${settings.includeComments ? '// Component logic\n' : ''}import { ref } from 'vue'${settings.useSemicolons ? ';' : ''}
</script>

<style scoped>
/* Add your component styles here */
</style>`;
};

// Generate Svelte code
const generateSvelteCode = (instances: ComponentInstance[], settings: ExportSettings): string => {
  if (instances.length === 0) {
    return `<script${settings.useTypeScript ? ' lang="ts"' : ''}>
  // Component logic
</script>

<div class="relative w-full min-h-[500px]">
  <!-- Add components to generate code -->
</div>

<style>
  /* Component styles */
</style>`;
  }

  const elements: string[] = [];

  instances.forEach(instance => {
    const comp = getComponentById(instance.componentId);
    if (!comp) return;

    const style = `style="position: absolute; left: ${instance.position.x}px; top: ${instance.position.y}px"`;
    
    switch (instance.componentId) {
      case 'button':
        elements.push(`  <button ${style} class="btn">${instance.props.text || 'Button'}</button>`);
        break;
      case 'input':
        elements.push(`  <input ${style} type="text" class="input" placeholder="${instance.props.text || 'Enter text...'}" />`);
        break;
      default:
        if (settings.includeComments) {
          elements.push(`  <!-- ${comp.name} -->`);
        }
    }
  });

  return `<script${settings.useTypeScript ? ' lang="ts"' : ''}>
${settings.includeComments ? '  // Component logic\n' : ''}  let count = 0${settings.useSemicolons ? ';' : ''}
</script>

<div class="relative w-full min-h-[500px]">
${elements.join('\n')}
</div>

<style>
  /* Add component styles */
</style>`;
};

// Generate JSON data
const generateJSONCode = (instances: ComponentInstance[], settings: ExportSettings): string => {
  const data = instances.map(instance => ({
    id: instance.id,
    componentId: instance.componentId,
    position: instance.position,
    props: instance.props,
    effects: instance.effects,
  }));

  return JSON.stringify({ 
    components: data,
    metadata: {
      generatedAt: new Date().toISOString(),
      count: instances.length,
    }
  }, null, settings.minifyOutput ? 0 : settings.indentSize);
};

// Generate HTML code
const generateHTMLCode = (instances: ComponentInstance[], settings: ExportSettings): string => {
  const indent = ' '.repeat(settings.indentSize);
  
  if (instances.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
${indent}<meta charset="UTF-8">
${indent}<meta name="viewport" content="width=device-width, initial-scale=1.0">
${indent}<title>My Component</title>
${indent}<link rel="stylesheet" href="styles.css">
</head>
<body>
${indent}<div class="container">
${indent}${indent}${settings.includeComments ? '<!-- Add components to generate code -->' : ''}
${indent}</div>
</body>
</html>`;
  }

  const elements: string[] = [];

  instances.forEach(instance => {
    const comp = getComponentById(instance.componentId);
    if (!comp) return;

    const styleAttr = `style="position: absolute; left: ${instance.position.x}px; top: ${instance.position.y}px"`;

    switch (instance.componentId) {
      case 'button':
        elements.push(`${indent}${indent}<button class="btn" ${styleAttr}>${instance.props.text || 'Button'}</button>`);
        break;
      case 'input':
        elements.push(`${indent}${indent}<input type="text" class="input" ${styleAttr} placeholder="${instance.props.text || 'Enter text...'}" />`);
        break;
      case 'badge':
        elements.push(`${indent}${indent}<span class="badge" ${styleAttr}>${instance.props.text || 'Badge'}</span>`);
        break;
      default:
        if (settings.includeComments) {
          elements.push(`${indent}${indent}<!-- ${comp.name} -->`);
        }
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
${indent}<meta charset="UTF-8">
${indent}<meta name="viewport" content="width=device-width, initial-scale=1.0">
${indent}<title>My Component</title>
${indent}<link rel="stylesheet" href="styles.css">
</head>
<body>
${indent}<div class="container">
${elements.join('\n')}
${indent}</div>
</body>
</html>`;
};

// Generate CSS code
const generateCSSCode = (instances: ComponentInstance[], settings: ExportSettings): string => {
  const indent = ' '.repeat(settings.indentSize);
  const semi = settings.useSemicolons ? ';' : '';
  
  return `.container {
${indent}position: relative${semi}
${indent}width: 100%${semi}
${indent}min-height: 500px${semi}
${indent}padding: 1rem${semi}
}

${settings.includeComments ? '/* Button Styles */\n' : ''}.btn {
${indent}display: inline-flex${semi}
${indent}align-items: center${semi}
${indent}justify-content: center${semi}
${indent}padding: 0.5rem 1rem${semi}
${indent}font-size: 0.875rem${semi}
${indent}font-weight: 500${semi}
${indent}border-radius: 0.375rem${semi}
${indent}background-color: #18181b${semi}
${indent}color: #fafafa${semi}
${indent}border: 1px solid #27272a${semi}
${indent}cursor: pointer${semi}
${indent}transition: all 0.2s ease${semi}
}

.btn:hover {
${indent}background-color: #27272a${semi}
}

${settings.includeComments ? '/* Input Styles */\n' : ''}.input {
${indent}display: block${semi}
${indent}width: 200px${semi}
${indent}padding: 0.5rem 0.75rem${semi}
${indent}font-size: 0.875rem${semi}
${indent}background-color: transparent${semi}
${indent}border: 1px solid #3f3f46${semi}
${indent}border-radius: 0.375rem${semi}
${indent}color: #fafafa${semi}
}

.input:focus {
${indent}outline: none${semi}
${indent}border-color: #f59e0b${semi}
${indent}box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2)${semi}
}

${settings.includeComments ? '/* Badge Styles */\n' : ''}.badge {
${indent}display: inline-flex${semi}
${indent}align-items: center${semi}
${indent}padding: 0.125rem 0.625rem${semi}
${indent}font-size: 0.75rem${semi}
${indent}font-weight: 600${semi}
${indent}border-radius: 9999px${semi}
${indent}background-color: #18181b${semi}
${indent}color: #fafafa${semi}
}`;
};

// Generate Tailwind code
const generateTailwindCode = (instances: ComponentInstance[], settings: ExportSettings): string => {
  const quote = settings.useSingleQuotes ? "'" : '"';
  const semi = settings.useSemicolons ? ';' : '';
  const indent = ' '.repeat(settings.indentSize);

  if (instances.length === 0) {
    return `import React from ${quote}react${quote}${semi}

export const MyComponent = () => {
${indent}return (
${indent}${indent}<div className=${quote}relative w-full min-h-[500px] p-4${quote}>
${indent}${indent}${indent}{/* Add components */}
${indent}${indent}</div>
${indent})${semi}
}${semi}`;
  }

  const elements: string[] = [];

  instances.forEach(instance => {
    const comp = getComponentById(instance.componentId);
    if (!comp) return;

    const posClass = `absolute left-[${instance.position.x}px] top-[${instance.position.y}px]`;

    switch (instance.componentId) {
      case 'button':
        elements.push(`${indent}${indent}<button className=${quote}${posClass} inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-zinc-900 text-zinc-50 border border-zinc-800 hover:bg-zinc-800 transition-colors${quote}>
${indent}${indent}${indent}${instance.props.text || 'Button'}
${indent}${indent}</button>`);
        break;
      case 'input':
        elements.push(`${indent}${indent}<input
${indent}${indent}${indent}type=${quote}text${quote}
${indent}${indent}${indent}placeholder=${quote}${instance.props.text || 'Enter text...'}${quote}
${indent}${indent}${indent}className=${quote}${posClass} w-[200px] px-3 py-2 text-sm bg-transparent border border-zinc-700 rounded-md text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20${quote}
${indent}${indent}/>`);
        break;
      default:
        if (settings.includeComments) {
          elements.push(`${indent}${indent}{/* ${comp.name} */}`);
        }
    }
  });

  return `import React from ${quote}react${quote}${semi}

export const MyComponent = () => {
${indent}return (
${indent}${indent}<div className=${quote}relative w-full min-h-[500px]${quote}>
${elements.join('\n')}
${indent}${indent}</div>
${indent})${semi}
}${semi}`;
};

export const CodeExport = ({ instances }: CodeExportProps) => {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('react');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ExportSettings>({
    useSemicolons: true,
    useSingleQuotes: false,
    indentSize: 2,
    includeComments: true,
    minifyOutput: false,
    includeImports: true,
    useTypeScript: true,
  });

  const code = useMemo(() => {
    switch (activeFormat) {
      case 'react':
        return generateReactCode(instances, settings);
      case 'html':
        return generateHTMLCode(instances, settings);
      case 'css':
        return generateCSSCode(instances, settings);
      case 'tailwind':
        return generateTailwindCode(instances, settings);
      case 'vue':
        return generateVueCode(instances, settings);
      case 'svelte':
        return generateSvelteCode(instances, settings);
      case 'json':
        return generateJSONCode(instances, settings);
      default:
        return '';
    }
  }, [activeFormat, instances, settings]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = () => {
    const format = formatConfig.find(f => f.id === activeFormat);
    if (!format) return;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component.${format.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded component.${format.extension}`);
  };

  const stats = useMemo(() => ({
    lines: code.split('\n').length,
    characters: code.length,
    components: instances.length,
  }), [code, instances]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-amber-500" />
          Export Code
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "h-7 px-2 text-xs",
            showSettings && "bg-zinc-800"
          )}
        >
          <Settings2 className="h-3 w-3 mr-1" />
          Settings
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <h4 className="text-xs font-medium text-zinc-400 mb-3">Export Settings</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="semicolons" className="text-xs text-zinc-400 cursor-pointer">
                Use Semicolons
              </Label>
              <Switch
                id="semicolons"
                checked={settings.useSemicolons}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, useSemicolons: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="quotes" className="text-xs text-zinc-400 cursor-pointer">
                Single Quotes
              </Label>
              <Switch
                id="quotes"
                checked={settings.useSingleQuotes}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, useSingleQuotes: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="comments" className="text-xs text-zinc-400 cursor-pointer">
                Include Comments
              </Label>
              <Switch
                id="comments"
                checked={settings.includeComments}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, includeComments: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="typescript" className="text-xs text-zinc-400 cursor-pointer">
                TypeScript
              </Label>
              <Switch
                id="typescript"
                checked={settings.useTypeScript}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, useTypeScript: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="imports" className="text-xs text-zinc-400 cursor-pointer">
                Include Imports
              </Label>
              <Switch
                id="imports"
                checked={settings.includeImports}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, includeImports: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="indent" className="text-xs text-zinc-400 cursor-pointer">
                Indent: {settings.indentSize} spaces
              </Label>
              <div className="flex gap-1">
                <button
                  onClick={() => setSettings(s => ({ ...s, indentSize: 2 }))}
                  className={cn(
                    "px-2 py-1 text-xs rounded border transition-colors",
                    settings.indentSize === 2
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400"
                  )}
                >
                  2
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, indentSize: 4 }))}
                  className={cn(
                    "px-2 py-1 text-xs rounded border transition-colors",
                    settings.indentSize === 4
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400"
                  )}
                >
                  4
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Format Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {formatConfig.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveFormat(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeFormat === id
                ? "bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-500/10"
                : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50 hover:border-zinc-600"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", activeFormat === id && color)} />
            {label}
          </button>
        ))}
      </div>

      {/* Code Preview */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <span className="text-xs text-zinc-500 ml-2">
              {formatConfig.find(f => f.id === activeFormat)?.label || 'Code'}
            </span>
          </div>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 hover:bg-zinc-800"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="ml-1.5 text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 hover:bg-zinc-800"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3" />
              <span className="ml-1.5 text-xs">Download</span>
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[420px] w-full">
          <pre className="p-4 text-xs font-mono leading-relaxed">
            <div className="table">
              {highlightCode(code, activeFormat)}
            </div>
          </pre>
        </ScrollArea>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-zinc-500">
            <span className="text-zinc-400 font-medium">{stats.components}</span> component{stats.components !== 1 ? 's' : ''}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500">
            <span className="text-zinc-400 font-medium">{stats.lines}</span> lines
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500">
            <span className="text-zinc-400 font-medium">{stats.characters}</span> characters
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Eye className="h-3 w-3" />
          <span>Live Preview</span>
        </div>
      </div>
    </div>
  );
};
