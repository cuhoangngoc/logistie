import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import katex from 'katex';
import hljs from 'highlight.js';

import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

hljs.configure({
  languages: ['javascript', 'ruby', 'python', 'java', 'c', 'cpp'],
});

const modules = {
  toolbar: [
    //make header bolded
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    [
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'code-block',
      'formula',
    ],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'code-block',
  'formula',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

// Quill editor component for React
// Received a callback function to get content
const Editor = ({ getContent, defaultValue }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.katex = katex;
    }
  }, []);

  return (
    <QuillNoSSRWrapper
      modules={modules}
      formats={formats}
      theme="snow"
      onChange={(value) => getContent(value)}
      defaultValue={defaultValue}
    />
  );
};

export default Editor;
