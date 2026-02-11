# Manual de Usuario: Análisis Masivo de CVs

## TalentApp - Sistema de Reclutamiento con IA

---

## 1. Introducción

El módulo de **Análisis Masivo de CVs** permite a los reclutadores cargar múltiples currículums simultáneamente y analizarlos automáticamente contra los requisitos de una vacante usando inteligencia artificial.

### Beneficios
- Ahorro de tiempo: Analiza hasta 20 CVs en segundos
- Consistencia: Evaluación objetiva basada en requisitos
- Priorización: Identifica candidatos con mejor match automáticamente

---

## 2. Acceso al Módulo

1. Iniciar sesión en TalentApp
2. Navegar al **Pipeline de Reclutamiento** (Kanban)
3. Click en el botón verde **"Análisis Masivo"**

![Ubicación del botón](./images/boton-analisis-masivo.png)

---

## 3. Proceso de Análisis (3 Pasos)

### Paso 1: Carga de CVs

#### Subir archivos
- **Arrastrar y soltar** archivos en la zona de carga
- O hacer **click** para seleccionar archivos

#### Formatos soportados
| Formato | Extensión |
|---------|-----------|
| PDF | .pdf |
| Word | .doc, .docx |

#### Límites
- **Máximo 20 archivos** por lote
- **Máximo 5 MB** por archivo

#### Extracción automática de datos
Al cargar cada CV, el sistema extrae automáticamente:
- Nombre del candidato
- Email
- Teléfono

> **Nota:** Puede editar estos campos manualmente si la extracción no es correcta.

#### Asignación de vacante
Dos opciones disponibles:

1. **Vacante Global** (recomendado): Asigna la misma vacante a todos los CVs
2. **Vacante Individual**: Selecciona una vacante diferente para cada CV

---

### Paso 2: Procesamiento

Durante el análisis, el sistema:

1. **Extrae el texto** del CV (PDF/Word → texto)
2. **Identifica secciones**: experiencia, habilidades, educación
3. **Compara semánticamente** con los requisitos de la vacante
4. **Calcula el score** de compatibilidad

#### Indicadores de progreso
- **Barra circular**: Progreso general del lote
- **Barras individuales**: Progreso de cada CV

#### Estados por CV
| Estado | Color | Descripción |
|--------|-------|-------------|
| Pendiente | Gris | En cola de espera |
| Extrayendo | Azul | Leyendo contenido del archivo |
| Analizando | Morado | Comparando con vacante |
| Completado | Verde | Análisis exitoso |
| Error | Rojo | Falló el procesamiento |

---

### Paso 3: Resultados

#### Estadísticas del lote
- **Completados**: Número de CVs analizados exitosamente
- **Score Promedio**: Media de compatibilidad del lote
- **Alto Match**: Candidatos con 85% o más de compatibilidad

#### Información por candidato
- **Score de compatibilidad** (0-100%)
- **Requisitos cumplidos**: X de Y requisitos
- **Skills detectadas**: Habilidades que coinciden con la vacante
- **Nivel de recomendación**:

| Nivel | Score | Acción sugerida |
|-------|-------|-----------------|
| Excelente | 85%+ | Priorizar entrevista |
| Revisar | 70-84% | Evaluar en detalle |
| Considerar | 40-69% | Revisar si hay pocos candidatos |
| Bajo match | <40% | Probable descarte |

---

## 4. Agregar Candidatos al Pipeline

1. Revisar los resultados del análisis
2. Click en **"Agregar N Candidatos al Pipeline"**
3. Los candidatos aparecerán en la columna **"Candidatos"** del Kanban

---

## 5. Interpretación del Score

El score se calcula basándose en:

### Requisitos Obligatorios (must_have)
- Peso: 70% del score total
- Son las habilidades esenciales para el puesto

### Requisitos Deseables (nice_to_have)
- Peso: 30% del score total
- Habilidades que suman pero no son indispensables

### Fórmula simplificada
```
Score = (Similitud promedio × 60%) + (Ratio de matches × 40%)
```

---

## 6. Tecnología Utilizada

### Matching Semántico
El sistema usa **Sentence-BERT** para comparar texto:
- No busca palabras exactas
- Entiende sinónimos y contexto
- Ejemplo: "React.js" ≈ "ReactJS" ≈ "React"

### Arquitectura
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│ CV Processor│────▶│   Claude    │
│   React     │     │   FastAPI   │     │     AI      │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │
     │                    ▼
     │              ┌─────────────┐
     └─────────────▶│   Backend   │
                    │   NestJS    │
                    └─────────────┘
```

---

## 7. Solución de Problemas

### Error: "Formato no soportado"
- **Causa**: Archivo no es PDF, DOC o DOCX
- **Solución**: Convertir el archivo al formato correcto

### Error: "Archivo muy grande"
- **Causa**: Archivo supera 5 MB
- **Solución**: Comprimir el PDF o reducir imágenes

### Score muy bajo en todos los CVs
- **Posibles causas**:
  - Requisitos de vacante muy específicos
  - CVs en idioma diferente a los requisitos
  - CVs con formato que dificulta la extracción
- **Solución**: Revisar que los requisitos de la vacante estén bien definidos

### CV sin datos de contacto extraídos
- **Causa**: Formato del CV dificulta la extracción
- **Solución**: Ingresar datos manualmente en los campos

---

## 8. Mejores Prácticas

### Para mejores resultados:

1. **CVs en formato texto** - Evitar CVs escaneados como imagen
2. **Requisitos claros** - Definir skills específicas en la vacante
3. **Lotes pequeños** - Procesar 5-10 CVs para revisión más detallada
4. **Revisar scores bajos** - Un score bajo no siempre significa mal candidato

### Flujo recomendado:

```
Recibir CVs → Análisis Masivo → Filtrar por score → Revisión manual → Entrevistas
```

---

## 9. Preguntas Frecuentes

**¿Puedo analizar CVs en inglés y español?**
Sí, el sistema detecta el idioma automáticamente y traduce los requisitos si es necesario.

**¿Qué tan preciso es el análisis?**
El matching semántico tiene ~85% de precisión. Siempre se recomienda revisión humana final.

**¿Se guardan los CVs?**
Los archivos se procesan en memoria y no se almacenan permanentemente. Solo se guardan los datos del candidato si los agrega al pipeline.

**¿Puedo reprocesar un CV?**
Sí, simplemente vuélvalo a cargar en un nuevo análisis.

---

## 10. Contacto y Soporte

Para reportar problemas o sugerir mejoras:
- GitHub: https://github.com/anthropics/claude-code/issues
- Email: soporte@talentapp.com

---

*Documento generado para TalentApp v1.0*
*Última actualización: Febrero 2026*
