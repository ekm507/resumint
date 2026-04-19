thisCV: a web-based CV builder
---


# technical details

## json schema

```json
{
  layout: {
    positions: [
      {item:place},
    ]
  }
  forms: {
    id: {
      title: string
      content: [
        {key: value},
      ]
    }
  }
  
}
```


#TODO
- pagination support
- simpler UX
- multilinguality
- better designed themes
- have a storage of several CVs in browser with copy and history functions
- modifiability of column layout

## milestone for version 1.0
- acceptable UX (peer reviewd)
- i18n implemented with Persian and English text. also bidi support
- rewrite the README.md file

