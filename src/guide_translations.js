/**
 * Spanish & French translations for Klasiz.fun Guide.
 * Imported and merged into HELP_GUIDES at load time.
 */

export const guideEs = {
  'landing': {
    title: 'Bienvenido a Klasiz.fun',
    body: `### Elige tu portal

**Profesores**
- Haz clic en **Iniciar sesión** para acceder al Portal del Profesor
- Haz clic en **Comenzar gratis** para crear tu primera clase

**Estudiantes**
- Haz clic en el rol **Estudiante**
- Ingresa el código de 5 dígitos de tu profesor
- Ve y completa las tareas

**Padres**
- Haz clic en el rol **Padre**
- Ingresa tu código de padre de 5 dígitos
- Ve el informe de progreso de tu hijo

---

### Cómo crear una cuenta de profesor

1. Haz clic en **Comenzar gratis** en la página principal
2. Ingresa tu correo electrónico y crea una contraseña
3. Verifica tu dirección de correo electrónico
4. Completa la configuración de tu perfil
5. ¡Comienza a crear tu primera clase!

---

### Inicio de sesión del profesor

1. Haz clic en el botón **Iniciar sesión** en la esquina superior derecha
2. Ingresa tu correo electrónico y contraseña
3. Haz clic en **Iniciar sesión** o usa **Inicio de sesión con Google** para acceso rápido

### Olvidé mi contraseña

1. Haz clic en **Iniciar sesión** luego en **¿Olvidaste tu contraseña?**
2. Ingresa tu dirección de correo electrónico
3. Revisa tu correo para el enlace de restablecimiento de contraseña
4. Crea una nueva contraseña e inicia sesión

---

### Inicio de sesión del estudiante

**Cómo los estudiantes acceden a su cuenta**

1. Haz clic en **Estudiante** en la página principal
2. Ingresa el código de acceso de 5 dígitos de tu profesor
3. No se necesita contraseña, ¡solo el código!

**Lo que los estudiantes pueden hacer**
- Ver lecciones y hojas de trabajo asignadas
- Completar tareas y enviar respuestas
- Seguir su progreso y puntos ganados
- Ver anuncios de clase del profesor

---

### Inicio de sesión del padre

**Cómo los padres ven el progreso**

1. Haz clic en **Padre** en la página principal
2. Ingresa el código de padre único de 5 dígitos
3. Ve el progreso académico de tu hijo
4. Ve informes detallados y seguimiento de comportamiento

**Lo que los padres pueden ver**
- Rendimiento académico y calificaciones
- Informes de comportamiento y retroalimentación
- Registros de asistencia
- Tareas y estado de finalización
- Comentarios y notas del profesor

---

### Resumen de funciones

**Gestión de clases**
- Crea y gestiona múltiples clases
- Agrega estudiantes con códigos simples de 5 dígitos
- Personaliza la configuración de clase y avatares

**Puntos y recompensas**
- Otorga puntos por buen comportamiento
- Sistema de aprendizaje gamificado
- Seguimiento de logros de estudiantes

**Tareas**
- Crea hojas de trabajo y cuestionarios
- Asigna a estudiantes o clases enteras
- Revisa y califica envíos
- Ve análisis detallados de envíos

**Juegos y actividades**
- Juegos de aula interactivos (Tornado, Memory Match)
- Herramientas de participación gamificada
- Selección aleatoria de ganador
- Temporizador y timbre para actividades

**Informes y análisis**
- Informes detallados de progreso del estudiante
- Seguimiento de comportamiento y retroalimentación
- Registros de asistencia
- Exportar informes a PDF

**Herramientas de aula**
- Pizarra digital para enseñanza
- Temporizador de cuenta regresiva para actividades
- Timbre de atención para enfocar la clase
- Compartir código QR para fácil acceso

---

### Preguntas frecuentes

**¿Es Klasiz.fun gratis?**
¡Sí! Los profesores pueden crear una cuenta gratis y comenzar a usar todas las funciones principales.

**¿Cómo agrego estudiantes?**
En el Panel de Clase, haz clic en el ícono de códigos de acceso para generar códigos únicos de 5 dígitos para cada estudiante.

**¿Los padres pueden seguir el progreso?**
¡Sí! Genera códigos de acceso de padre en el Panel de Clase para dar a los padres acceso de solo lectura al progreso de su hijo.

**¿Qué dispositivos funcionan con Klasiz.fun?**
Klasiz.fun funciona en cualquier dispositivo con navegador web: computadoras, tabletas y teléfonos inteligentes.

---

### Obtener ayuda

¡Haz clic en el ícono de burbuja de ayuda en cualquier momento para obtener respuestas rápidas sobre cualquier función!

---

*Después de iniciar sesión, los profesores ven sus clases y pueden hacer clic en cualquier tarjeta de clase para entrar al Panel de Clase.*`
  },
  'teacher-portal': {
    title: 'Portal del Profesor',
    body: `### Gestiona clases desde el panel lateral

El Portal del Profesor ahora usa un panel **Mis Clases** a la izquierda y el espacio de trabajo de la clase activa a la derecha.

---

#### Conceptos básicos del panel de clases

- Haz clic en cualquier clase para abrirla en el espacio de trabajo.
- Usa el **botón de flecha** en la parte superior del panel para colapsar o expandir la lista de clases.
- En dispositivos móviles, tocar fuera del panel lo cierra automáticamente.
- Usa **arrastrar y soltar** dentro del panel para reordenar las clases.

---

#### Agregar / Editar / Eliminar una clase

**Agregar**
- Haz clic en el botón **+ Agregar nueva clase** en el panel.
- Ingresa el nombre de la clase, elige el estilo de avatar o sube tu propia imagen.
- Elige el color de fondo del panel de clase y guarda.

**Editar**
- Usa el **menú ⋮** en la fila de la clase, luego elige **Editar clase**.

**Eliminar**
- Usa el **menú ⋮** en la fila de la clase, luego elige **Eliminar clase** y confirma.

---

#### Herramientas del espacio de trabajo

- Expande **Herramientas del espacio de trabajo** para abrir el **Planificador de lecciones**.
- Usa **Exportar respaldo** para descargar tu respaldo JSON de datos de clase.

---

*Las actualizaciones de clase y cambios de orden se guardan automáticamente.*`
  },
  'class-dashboard': {
    title: 'Panel de Clase',
    body: `### Tu centro de mando del aula

Usa esta página para gestionar puntos, asistencia, estudiantes, tareas, informes y herramientas de aula para una clase.

---

#### Navegación principal (Dock / Barra lateral)

Dependiendo del diseño, las herramientas aparecen en una barra lateral izquierda o dock inferior.

| Ícono | Qué abre |
|---|---|
| 📋 | Tareas |
| 💬 | Bandeja de entrada / calificación |
| 👥 | Modo de asistencia |
| 🔳 | Códigos de acceso de estudiantes y padres |
| 📊 | Informes |
| 🎨 | Pizarra |
| ⚙️ | Configuración de tarjetas de puntos |
| 🎮 | Centro de juegos |

---

#### Barra de herramientas superior

- **Historial**: ver historial de puntos de la clase.
- **Ordenar**: Nombre (A-Z) o Puntos más altos.
- **Tamaño de visualización**: Compacto, Regular, Espacioso.
- **Pantalla completa**: mostrar o salir de pantalla completa.
- **Selección múltiple**: selecciona varios estudiantes, luego otorga un comportamiento a todos los seleccionados.

---

#### Dar puntos

**Estudiante individual**
- Haz clic en una tarjeta de estudiante, luego elige una tarjeta de comportamiento.

**Toda la clase**
- Haz clic en la tarjeta **Toda la Clase** y elige un comportamiento.
- Solo los estudiantes presentes se incluyen en premios de toda la clase.

**Selección múltiple**
- Activa la selección múltiple desde la barra de herramientas.
- Toca las tarjetas de estudiantes para seleccionar.
- Haz clic en **Dar Puntos** y elige un comportamiento.

---

#### Modo de asistencia

- Activa el modo de asistencia desde la navegación.
- Toca los estudiantes para marcar ausente/presente.
- Los estudiantes ausentes se excluyen de las recompensas de toda la clase.

---

#### Gestión de estudiantes

- **Agregar estudiante** desde la tarjeta al final de la cuadrícula.
- **Editar/Eliminar** pasando el cursor sobre una tarjeta de estudiante en escritorio, o presionando largo en dispositivos táctiles.

---

#### Cambio de clase

- Usa el selector de clase en el encabezado del panel para saltar entre clases rápidamente.

---

*Los cambios en puntos, asistencia, estudiantes y configuración se guardan automáticamente.*`
  },
  'assignments': {
    title: 'Tareas',
    body: `### Crear y publicar hojas de trabajo

**Paso 1: Ingresa los detalles de la tarea**
- Escribe un título para tu hoja de trabajo
- Agrega preguntas usando el panel derecho

---

#### Tipos de preguntas

| | |
|---|---|
| 📝 | Respuestas de texto libre |
| ☑️ | Los estudiantes eligen entre opciones |
| 🔤 | Escribe \`[blank]\` donde van las respuestas |
| ↔️ | Conecta elementos de izquierda a derecha |
| 📖 | Incluye un pasaje con preguntas |
| ✅ | Respuestas simples de verdadero o falso |
| 🔢 | Solo números |
| ↕️ | Arrastra partes para reordenar oraciones |
| 📊 | Categoriza elementos en grupos |

---

**Paso 2: Agregar preguntas**
- Haz clic en un botón de tipo de pregunta en el panel derecho
- Escribe tu pregunta
- **Agregar imágenes:** Haz clic en el ícono de imagen dentro de una pregunta
- **Eliminar preguntas:** Haz clic en el ícono de papelera junto a una pregunta

---

**Paso 3: Asignar y publicar**
- Elige quién recibe la tarea:
  - **Todos los estudiantes** - todos en la clase
  - **Seleccionar estudiantes** - elige estudiantes específicos
- Haz clic en **Publicar en la clase**

---

*Las preguntas vacías no se pueden publicar. Llena los campos requeridos primero.*`
  },
  'inbox': {
    title: 'Mensajes y Calificación',
    body: `### Revisar y calificar envíos de estudiantes

---

#### Dos secciones

**Esperando revisión**
- Estos son nuevos envíos de estudiantes
- Haz clic en cualquier envío para ver respuestas
- Ingresa una calificación y haz clic en guardar

**Recientemente calificados**
- Estos son envíos que ya has calificado
- Haz clic para revisar lo que diste
- Puedes recalificar si es necesario

---

#### Flujo de calificación

1. Haz clic en un envío de la lista de espera
2. Ve las respuestas del estudiante en el panel izquierdo
3. Ingresa puntos/calificación en el campo
4. Haz clic en el ícono ✅ para guardar
5. La calificación se agrega al puntaje total del estudiante
6. El envío se mueve a "Recientemente calificados"

---

#### Recalificación

Si necesitas cambiar una calificación:
- Haz clic en el envío nuevamente
- Ingresa la nueva calificación
- Haz clic en guardar
- Solo se agrega/resta la diferencia

---

#### Salir

Haz clic en la **X** o botón de cerrar para volver al panel.

---

*La insignia en el ícono de mensajes muestra cuántos envíos están esperando revisión.*`
  },
  'settings': {
    title: 'Configuración',
    body: `### Configurar tarjetas de puntos

Configura tarjetas de puntos: **Agregar**, **Editar**, **Eliminar tarjetas**

#### Tarjetas de puntos

Estas son las recompensas y penalidades que das a los estudiantes.

**Ver**
- Cada tarjeta muestra:
  - Ícono de emoji
  - Nombre de la tarjeta (ej. "Gran Trabajo")
  - Tipo (WOW para positivo, NO NO para negativo)
  - Valor de puntos (+1, +2, -1, etc.)

**Agregar una tarjeta**
- Haz clic en **Agregar Tarjeta** (➕) en el encabezado
- Ingresa el nombre de la tarjeta
- Elige un emoji del selector de stickers
- Establece el valor de puntos (positivo o negativo)
- Haz clic en guardar

**Editar una tarjeta**
- Haz clic en el ícono ✏️ (lápiz) en cualquier tarjeta
- Cambia nombre, emoji o puntos
- Haz clic en el ícono de guardar (✅)

**Eliminar una tarjeta**
- Haz clic en el ícono 🗑️ (papelera) en cualquier tarjeta
- Confirma la eliminación

---

#### Restablecer valores predeterminados
- Haz clic en **Restablecer** (🔄) para restaurar el conjunto original de tarjetas de puntos
- Esto reemplaza todas tus tarjetas personalizadas

---

*Los cambios se guardan automáticamente en todas tus clases.*`
  },
  'access-codes': {
    title: 'Códigos de Acceso',
    body: `### Códigos de inicio de sesión para estudiantes y padres

Cada estudiante tiene dos códigos de 5 dígitos:

| Tipo de código | Usado por | Propósito |
|------------|-----------|---------|
| Código de estudiante | Estudiantes | Iniciar sesión en el Portal del Estudiante y completar tareas |
| Código de padre | Padres | Ver informes y progreso de su hijo |

---

#### Códigos QR

Cada código también se muestra como un código QR.

**Escanear un código QR**
- Apunta la cámara de tu teléfono/tableta al código QR
- Inicia sesión automáticamente en el portal correcto
- ¡Sin necesidad de escribir!

**Copiar un código QR**
- Haz clic en el botón **Copiar QR** junto a cualquier estudiante
- El código QR se guarda en tu portapapeles como imagen
- Pega en correos electrónicos, documentos o imprime para compartir

---

#### Códigos generados

- Los códigos se crean automáticamente cuando se abre esta página
- Cada estudiante recibe códigos únicos
- Los códigos son permanentes y no cambian

---

#### Copiar código de texto

- Haz clic en cualquier código de 5 dígitos para copiarlo
- Da el código al padre o estudiante
- Lo ingresan en la pantalla de inicio de sesión

---

*Los padres solo pueden ver los datos de su propio hijo. Los estudiantes solo pueden ver las tareas enviadas a ellos.*`
  },
  'whiteboard': {
    title: 'Pizarra',
    body: `### Dibuja, escribe y comparte

La pizarra es un lienzo en blanco para actividades de aula.

---

#### Herramientas de dibujo (lado derecho)

| | |
|---|---|
| ✏️ Lápiz | Dibuja libremente en el lienzo |
| 🖍️ Resaltador | Superposición de color transparente |
| 📝 Texto | Escribe texto y presiona Enter para colocar |
| 🧹 Borrador | Elimina dibujos |
| 😊 Emoji | Estampa emojis en el tablero |

---

#### Opciones del lienzo

**Selector de colores**
- 10 colores preestablecidos disponibles
- Haz clic en cualquier color para seleccionar

**Tamaño de línea/trazo**
- Ajusta el grosor de tus líneas
- Usa el deslizador o botones

**Opciones de fuente**
- Familia: Moderna, Divertida, Elegante, Máquina de escribir, Negrita
- Tamaño: Haz el texto más grande o más pequeño

**Agregar imágenes**
- Haz clic en el ícono de imagen
- Sube fotos desde tu dispositivo
- Redimensiona y posiciona según sea necesario

---

#### Acciones

**Exportar PNG**
- Haz clic para descargar la pizarra como imagen
- Guarda en cualquier lugar de tu computadora
- Comparte con los estudiantes después

**Limpiar lienzo**
- Haz clic en el ícono de papelera
- Borra todo el tablero

---

*Usa la pizarra para problemas de matemáticas, diagramas, lluvia de ideas o cualquier lección visual.*`
  },
  'student-portal': {
    title: 'Portal del Estudiante',
    body: `### Completa tareas y gana puntos

Los estudiantes inician sesión con un código de 5 dígitos para ver su trabajo.

---

#### Inicio de sesión

1. Ingresa tu código de estudiante de 5 dígitos (de tu profesor)
2. Haz clic en **Iniciar sesión**

---

#### Tareas

Verás todas las tareas de tu profesor:

**Sin completar** (mostradas primero)
- De más nuevas a más antiguas
- Estas están esperándote
- Haz clic para abrir y completar

**Completadas** (mostradas abajo)
- De más nuevas a más antiguas
- Ya terminadas
- Puedes ocultar de la vista (haz clic en el botón ocultar)

---

#### Completar una tarea

1. Haz clic en cualquier tarea sin completar
2. Responde todas las preguntas
3. Haz clic en **Enviar**
4. Tu trabajo se envía a tu profesor
5. ¡Recibirás tu calificación pronto!

---

#### Tus estadísticas

En la parte superior de la página, puedes ver:
- **Puntos totales** - Todos los puntos que has ganado
- **Completadas** - Número de tareas hechas
- **Por hacer** - Tareas esperándote

---

*Actualiza la página si tu profesor acaba de enviar una nueva tarea.*`
  },
  'parent-portal': {
    title: 'Portal de Padres',
    body: `### Ve el progreso de tu hijo

Los padres usan un código de 5 dígitos para ver la información de su hijo.

---

#### Inicio de sesión

1. Ingresa tu código de padre de 5 dígitos (del profesor de tu hijo)
2. Haz clic en **Iniciar sesión**

---

#### Lo que verás

- El total de puntos actual de tu hijo
- Gráfico de comportamiento diario
- Desglose de comportamiento (positivo vs necesita mejorar)
- Retroalimentación del profesor generada por IA
- Registros de asistencia

---

#### Períodos de tiempo

Cambia la vista para ver datos de:
- Esta semana
- Este mes
- Este año

---

#### Idioma

Alterna entre idiomas para cambiar el idioma del informe.

---

*Tu acceso es de solo lectura. Solo los profesores pueden hacer cambios.*`
  },
  'lesson-planner': {
    title: 'Planificador de Lecciones',
    body: `### Planifica tus lecciones

Crea y organiza lecciones con calendarios y plantillas.

---

#### Comenzar

**Abrir Planificador de Lecciones**
- Desde el Portal del Profesor, haz clic en **Planificador de Lecciones** (o el ícono de calendario)
- Verás tu vista mensual y cualquier plantilla guardada

**Vista mensual**
- Ve todos los días del mes de un vistazo
- Haz clic en un día para agregar o editar lecciones
- Usa las flechas para cambiar de mes

---

#### Plantillas

**Usar una plantilla**
- Elige una plantilla para estructurar tu semana o día
- Llena materias y actividades
- Guarda para aplicar el plan a tu calendario

**Crear la tuya**
- Construye plantillas personalizadas para tu horario
- Reutilízalas a lo largo de semanas o meses

---

#### Consejos

- Planifica con anticipación para todo el mes
- Duplica una semana para ahorrar tiempo
- Exporta o imprime tu plan si es necesario

---

*Los planes de lección se guardan automáticamente.*`
  },
  'games': {
    title: 'Juegos',
    body: `### Juegos de aula

Juega juegos divertidos con tu clase: Tornado, Memory Match, Quiz y más.

---

#### Abrir juegos

**Desde el portal**
- En el Portal del Profesor, haz clic en **Juegos** (o el ícono del control de juegos)
- Elige un juego de la lista

**Desde el panel**
- Algunos juegos se pueden lanzar desde la barra lateral del panel de clase
- Lucky Draw está en la barra lateral; los juegos completos se abren desde el portal

---

#### Tipos de juegos

**Tornado**
- Gira la rueda para elegir estudiantes u opciones
- Genial para selección aleatoria y recompensas

**Memory Match**
- Voltea cartas para encontrar parejas
- Usa tus propias imágenes o conjuntos predeterminados

**Quiz**
- Opción múltiple o respuesta corta
- Agrega tus propias preguntas

**Otros**
- Face Off, Carrera de Motos, Carrera de Caballos, Deletrear la Palabra y más
- Cada juego tiene sus propias reglas y configuración

---

#### Durante el juego

- Modo de pantalla completa para exhibición en clase
- Usa el botón de retroceso para volver a la lista de juegos o portal

---

*Los juegos funcionan mejor cuando toda la clase puede ver la pantalla.*`
  },
  'reports': {
    title: 'Informes',
    body: `### Ver progreso y análisis del estudiante

Esta página muestra informes detallados y análisis para tus estudiantes.

---

#### Períodos de tiempo

Cambia el rango de tiempo para ver datos:
- **Semana** - Últimos 7 días
- **Mes** - Últimos 30 días
- **Año** - Últimos 12 meses

---

#### Selección de estudiante

Ve informes para todos los estudiantes o selecciona uno:
- Usa el menú desplegable para filtrar un estudiante específico
- Cada estudiante muestra su propia tarjeta de informe

---

#### Contenido de la tarjeta de informe

Cada informe de estudiante incluye:

**Información del estudiante**
- Nombre e ID del estudiante
- Avatar o imagen de personaje
- Total de puntos ganados

**Retroalimentación del profesor con IA**
- Resumen generado automáticamente
- Destaca fortalezas y áreas que necesitan trabajo
- Basado en patrones de comportamiento
- El profesor puede editar (haz clic en el botón editar)

**Gráfico de distribución de comportamiento**
- Puntos diarios para el período seleccionado
- Gráfico de barras mostrando tendencias de puntos
- Comportamientos positivos mostrados en verde
- Comportamientos que necesitan mejorar mostrados en rojo

---

#### Opciones de exportación

**Descargar PDF**
- Haz clic en el botón PDF (esquina superior derecha)
- Descarga el informe como archivo PDF
- Incluye todos los gráficos y datos
- Listo para imprimir o compartir

---

*Los informes ayudan a los profesores a seguir el progreso de los estudiantes y comunicarse con los padres.*`
  },
  'liveworksheet-config': {
    title: '📄 Guía de configuración',
    body: `### 📄 Hoja de trabajo en vivo: Guía de configuración

#### 1. Sube tu material

**Formatos compatibles:** Puedes subir archivos PDF o documentos de Microsoft Word (.docx).

**Cómo subir:** Arrastra tu archivo directamente a la zona de carga o haz clic en el icono "Examinar" para seleccionar un archivo de tu computadora.

**Extracción automática:** Una vez subido, la herramienta escaneará automáticamente el documento e intentará extraer el texto e identificar posibles preguntas.

---

#### 2. Revisar y editar preguntas

**Lista de preguntas:** Las preguntas extraídas aparecerán en una lista. Si la herramienta identifica un formato específico (como opción múltiple), lo categorizará automáticamente.

**Ajustes manuales:** Puedes editar el texto de la pregunta, agregar o eliminar opciones y seleccionar la respuesta correcta.

**Tipos de preguntas:** Puedes cambiar el tipo de cualquier pregunta usando el menú desplegable. Las opciones incluyen:

**Opción múltiple:** Formato estándar A/B/C/D.

**Completar espacios:** Los estudiantes escriben la palabra faltante.

**Verdadero/Falso:** Verificación rápida de comprensión.

**Emparejar y ordenar:** Tareas interactivas de arrastrar y soltar.

**Comprensión:** Mejor para historias más largas seguidas de varias preguntas.

---

#### 3. Agregar nuevo contenido

Si la extracción omitió una pregunta o si deseas agregar más, haz clic en el botón "➕ Agregar pregunta" en la parte inferior de la lista para crear una nueva desde cero.`
  },
  'liveworksheet-game': {
    title: '🛠️ Cómo administrar',
    body: `### 🛠️ Cómo administrar tu hoja de trabajo

#### Organizar el flujo

**Reordenar:** Usa las flechas arriba y abajo en cada tarjeta de pregunta para cambiar el orden en que aparecen a los estudiantes.

**Eliminar:** Usa el icono de papelera para eliminar cualquier texto innecesario o preguntas identificadas incorrectamente que se capturaron durante el proceso de extracción.

---

#### La verificación final

En la parte inferior de la pantalla, la herramienta rastrea tus preguntas válidas. Una pregunta se considera válida una vez que tiene un mensaje, opciones (si es necesario) y una respuesta correcta designada.

Solo puedes asignar la hoja de trabajo una vez que al menos una pregunta esté completamente validada.

---

#### Finalizar la tarea

**Jugar ahora:** Esto lanza la hoja de trabajo inmediatamente en "Modo aula" para una actividad en vivo en el pizarrón.

**Asignar:** Esto envía la hoja de trabajo a tu portal de estudiantes, permitiendo que los estudiantes la completen en sus propios dispositivos.

---

#### 💡 Consejos del profesor para hojas de trabajo digitales

**Los documentos limpios funcionan mejor:** Para la extracción más precisa, intenta usar documentos con encabezados claros y preguntas numeradas. Si un PDF es solo una imagen (como una foto de una página), la extracción de texto puede no funcionar; asegúrate de que el PDF contenga texto seleccionable.

**Andamiaje con modo "Comprensión":** Al usar el tipo Historia/Comprensión, mantén el pasaje de texto conciso. La lectura digital puede ser más cansada que la lectura en papel, por lo que dividir historias más largas en dos hojas de trabajo más pequeñas puede ayudar a mantener el enfoque del estudiante.

**Mezclar tipos de preguntas:** Para prevenir la "fatiga de clics", mezcla tu hoja de trabajo con diferentes tipos. Sigue algunas preguntas de "Opción múltiple" con una tarea de "Ordenar" o "Clasificar" para mantener a los estudiantes cognitivamente comprometidos con diferentes estilos de interacción.

**El poder de "Completar espacios":** Para práctica de ortografía y gramática, usa el tipo "Espacio". Obliga a los estudiantes a producir el lenguaje en lugar de solo reconocerlo, convirtiéndolo en una evaluación más rigurosa de su capacidad de escritura real.

**Retroalimentación inmediata:** Dado que esta herramienta digitaliza la hoja de trabajo, los estudiantes obtienen retroalimentación instantánea sobre sus respuestas al jugar en vivo. Usa el modo "Jugar ahora" para revisar una hoja de trabajo juntos después de que hayan terminado, enfocándote en las preguntas donde la mayoría de los estudiantes cometieron errores.`
  },
  'Messages & Grading': {
    title: 'Bandeja de entrada — Revisar envíos',
    body: `### Calificar trabajo de estudiantes

**Ver envíos**
- Haz clic en el icono 💬 (mensajes) en la barra lateral
- Aparecen dos secciones:
  - **Esperando revisión** - envíos que necesitan calificaciones
  - **Recientemente calificados** - revisiones completadas

---

**Calificar un envío**
1. Haz clic en cualquier envío en la lista de espera
2. Ve las respuestas del estudiante a la izquierda
3. Ingresa puntos/calificación en el campo de entrada
4. Haz clic en el icono ✅ (verificar) para guardar

---

**Qué sucede después de calificar**
- El envío se mueve a "Recientemente calificados"
- La calificación se agrega al puntaje total del estudiante
- Si recalificas, solo se agrega la diferencia

---

**Salir de la bandeja de entrada**
- Haz clic en el botón cerrar (X) para volver al panel

---

*Usa el botón de actualizar si los estudiantes acaban de enviar nuevo trabajo.*`
  },
  'settings-cards': {
    title: 'Tarjetas de puntos',
    body: `### Configurar tarjetas de puntos

**Agregar**, **Editar**, **Eliminar tarjetas**

#### Tarjetas de puntos

Crea tarjetas personalizadas para recompensar comportamientos específicos:

**Agregar nueva tarjeta**
- Haz clic en "➕ Agregar tarjeta"
- Ingresa el nombre del comportamiento
- Establece el valor de puntos (+positivo o -negativo)
- Elige un color para la tarjeta
- Haz clic en guardar

**Editar tarjeta**
- Haz clic en cualquier tarjeta existente
- Modifica nombre, puntos o color
- Guarda los cambios

**Eliminar tarjeta**
- Haz clic en el icono de papelera en la tarjeta
- Confirma la eliminación

---

*Las tarjetas de puntos aparecen en el panel de clase para un seguimiento rápido del comportamiento.*`
  },
  'games-config': {
    title: 'Configuración de juegos',
    body: `### Configurar juegos

Cada juego tiene su propia pantalla de configuración con opciones específicas.

#### Pasos comunes

1. **Seleccionar jugadores**
   - Elige estudiantes individuales o equipos
   - Algunos juegos requieren exactamente 2 jugadores
   - Otros permiten hasta 4 jugadores o equipos

2. **Agregar contenido**
   - Sube imágenes
   - Ingresa palabras de vocabulario
   - Crea preguntas y respuestas

3. **Configurar opciones**
   - Ajusta la dificultad
   - Establece el número de rondas
   - Elige temas o colores

4. **Iniciar juego**
   - El botón "Iniciar juego" se desbloquea cuando todo está listo
   - Haz clic para lanzar el juego en pantalla completa

---

**Tornado**
- Agrega palabras e imágenes
- Elige número de fichas
- Decide cuántos tornados incluir

**Memory Match**
- Sube pares de imágenes o palabras
- Selecciona 1-4 jugadores
- Elige un tema de color

**Quiz**
- Agrega preguntas y opciones
- Establece la respuesta correcta
- Selecciona exactamente 2 estudiantes

---

*Cambia siempre la configuración antes de comenzar el juego.*`
  },
  'tornado-game': {
    title: '🌪️ Cómo jugar',
    body: `### 🎮 Cómo jugar

#### El objetivo
Túrnense para voltear fichas y recoger la mayor cantidad de puntos. ¡Pero ten cuidado—encontrar un tornado hará volar todos tus puntos!

---

#### Turnarse

Busca la insignia "🎯 ¡TU TURNO! 🎯" para ver de quién es el turno.

El estudiante o equipo debe responder una pregunta, leer una palabra o identificar una imagen del pizarrón antes de que se les permita elegir una ficha.

Haz clic en cualquier ficha no revelada para voltearla y ver qué hay debajo. El juego pasará automáticamente el turno al siguiente jugador después de voltear una ficha.

---

#### Tipos de cartas

**Puntos (+1 a +10):** Agrega puntos estándar a tu puntuación.

**Doble (x2):** ¡Un hallazgo afortunado! Multiplica el valor oculto de la carta por 2.

**Triple (x3):** ¡Un hallazgo súper afortunado! Multiplica el valor oculto de la carta por 3.

**Tornado (🌪️):** ¡Cuidado! Si volteas esto, una animación de tornado gira por la pantalla y tu puntuación baja exactamente a 0.

---

#### Controles del profesor (Ajustes manuales)

¿Un estudiante dio una respuesta excepcionalmente buena, o necesitas corregir un error? Puedes ajustar manualmente la puntuación de cualquier jugador en cualquier momento haciendo clic en los botones + o - ubicados en su panel de jugador.

---

#### Ganar el juego

El juego termina cuando cada ficha del tablero ha sido volteada.

¡El jugador o equipo con la puntuación más alta es coronado ganador con una divertida celebración de confeti!

En la pantalla de victoria, tienes la opción de otorgar instantáneamente puntos de clase de bonificación (+1, +2, +3 o +5) al estudiante o equipo ganador antes de jugar de nuevo.`
  },
  'tornado-config': {
    title: '🌪️ Guía de configuración',
    body: `### 🌪️ Juego Tornado: Guía de configuración

#### 1. Elige tus jugadores

**Modo individual:** Selecciona estudiantes específicos para jugar entre sí (mínimo 2, máximo 4 jugadores).

**Modo equipo:** Divide la clase en 2, 3 o 4 equipos. El juego ordenará automáticamente tu clase seleccionada en grupos con sus propios colores de equipo divertidos.

---

#### 2. Configurar el tablero de juego

**Número de fichas:** Usa el control deslizante para elegir cuántas fichas aparecerán en el tablero, desde un juego rápido de 10 fichas hasta un tablero masivo de 40 fichas.

**Fichas numeradas:** Activa esto para mostrar números en el reverso de las cartas (genial para que los estudiantes digan el número que quieren). Desactívalo para mostrar un icono de estrella en su lugar.

**Conteo de tornados:** ¡Decide qué tan peligroso es el tablero! Elige exactamente cuántas cartas de tornado están ocultas (1 a 5), o selecciona "Aleatorio" para mantener a todos adivinando.

---

#### 3. Agrega tu contenido de lección

**Subir imágenes:** Haz clic o arrastra y suelta hasta 20 archivos de imagen en el cuadro de carga. El juego mostrará estos alrededor del tablero.

**Ingresar palabras:** Escribe palabras de vocabulario separadas por comas (ej., manzana, gato, perro) y haz clic en Agregar. Estas se enmarcarán alrededor del tablero de juego junto con tus imágenes para indicar a los estudiantes durante el juego.

---

#### 4. Iniciar el juego
Una vez que tus jugadores estén seleccionados y tu contenido esté cargado, el botón brillante "Iniciar juego" en la parte inferior de la pantalla se desbloqueará.`
  },
  'memorymatch-game': {
    title: '🎮 Cómo jugar',
    body: `### 🎮 Cómo jugar

#### El objetivo
Encuentra y empareja todos los pares ocultos detrás de las cartas. ¡El jugador con más coincidencias al final del juego gana!

---

#### Turnarse

El panel de puntuación del jugador activo brillará o pulsará, indicando que es su turno.

Un jugador hace clic en dos cartas para voltearlas.

**Si coinciden:** Las cartas permanecen visibles (o desaparecen), el jugador gana un punto y puede ir de nuevo.

**Si no coinciden:** Las cartas se sacudirán brevemente y luego se voltearán de nuevo. El turno pasa al siguiente jugador.

---

#### Ganar el juego

El juego termina cuando todos los pares han sido encontrados exitosamente.

Aparecerá una pantalla de campeón con confeti, destacando al(los) ganador(es).

Bonificación del profesor: Desde la pantalla de victoria, puedes otorgar instantáneamente puntos de clase (+1, +2, +3 o +5) al perfil digital del ganador.

---

#### 💡 Consejos del profesor para Memory Match

**Emparejamiento escalonado (Imagen a palabra):** Para estudiantes más jóvenes o vocabulario nuevo, usa una configuración de imagen a texto. Esto obliga al estudiante a conectar el concepto visual con la ortografía escrita, lo cual es más cognitivamente exigente (y gratificante) que el simple emparejamiento de imagen a imagen.

**La regla de "Respuesta coral":** Para mantener a toda la clase comprometida durante una coincidencia 1 a 1, haz que toda la clase diga la palabra en voz alta cada vez que se voltea una carta. Esto asegura que incluso los estudiantes que no están jugando actualmente estén practicando su pronunciación.

**Activadores de memoria intencionales:** Si un estudiante voltea una carta y pierde una coincidencia, pídele que describa la ubicación (ej., "¿Dónde estaba la 'Manzana'? ¡Arriba a la izquierda!"). Esto fomenta el uso del lenguaje posicional (arriba, abajo, izquierda, derecha) junto con el vocabulario de la lección.

**Ajustar la dificultad:** Si el juego avanza demasiado lento, puedes reducir el número de pares en la configuración. Para estudiantes avanzados, aumenta el tamaño de la cuadrícula para probar su memoria espacial a corto plazo y enfoque.

**Modo colaborativo:** Aunque el juego rastrea puntuaciones individuales, puedes tratarlo como un desafío "Clase contra el reloj". Haz que los estudiantes trabajen juntos para encontrar todas las coincidencias en menos de dos minutos para ganar una recompensa grupal.`
  },
  'memorymatch-config': {
    title: '🧠 Guía de configuración',
    body: `### 🧠 Memory Match: Guía de configuración

#### 1. Carga tu contenido de lección

**Elementos de contenido:** Puedes agregar vocabulario de dos maneras:

**Texto:** Escribe una palabra y haz clic en Agregar. Esto crea una carta basada en texto.

**Imágenes:** Arrastra y suelta imágenes en la zona de carga. Estas aparecerán como cartas visuales.

**Crear pares:** El juego duplica automáticamente tus elementos para crear pares, o puedes mezclar y combinar imágenes con sus palabras correspondientes para crear desafíos de "Imagen a texto".

*(Nota: Necesitas al menos 2 elementos para comenzar, pero para un desafío estándar, se recomiendan de 6 a 12 elementos.)*

---

#### 2. Seleccionar los competidores

**Selección de jugadores:** Elige entre 1 y 4 jugadores.

**Asignar estudiantes:** Selecciona estudiantes de tu lista de clase. A cada estudiante se le asignará un color único y un rastreador de puntuación dedicado en la parte superior de la pantalla.

---

#### 3. Elegir un tema

Elige un color de fondo (Azul cielo, Verde pálido, Rosa claro o Mocasín) para establecer el ambiente de la sesión.

---

#### 4. Lanzar el tablero

Una vez que tus estudiantes estén seleccionados y el contenido esté listo, haz clic en el botón "Iniciar juego" para generar la cuadrícula.`
  },
  'quiz-game': {
    title: '🎮 Cómo jugar',
    body: `### 🎮 Cómo jugar

#### El objetivo
Sé el primero en hacer clic en la respuesta correcta en tu lado de la pantalla.

---

#### La pantalla de batalla

La pantalla está dividida en dos lados idénticos. La pregunta y la imagen aparecen en el centro para que ambos jugadores las vean.

Cuando aparece una pregunta, ambos estudiantes compiten para encontrar la opción correcta en su propio lado.

---

#### Puntuación y resultados

**Respuesta correcta:** El primer jugador en hacer clic en la elección correcta obtiene el punto. El juego mostrará una marca de verificación verde y se moverá automáticamente a la siguiente pregunta.

**Respuesta incorrecta:** Si un jugador hace clic en el botón incorrecto, se bloquea brevemente, dando a su oponente la oportunidad de responder.

---

#### Victoria y recompensas

Una vez que todas las preguntas están terminadas, se muestran las puntuaciones finales.

**Puntos de clase:** Puedes otorgar instantáneamente puntos de bonificación (+1, +2, +3 o +5) al perfil digital del ganador directamente desde la pantalla del trofeo.

---

#### 💡 Consejos del profesor para el juego de Quiz

**Distractores efectivos:** Al enseñar fonética, usa opciones que se vean o suenen similares (ej., Pregunta: "Ship" | Opciones: Sheep, Ship, Chip, Shop). Esto obliga a los estudiantes a mirar de cerca los grafemas en lugar de solo adivinar.

**Indicaciones solo con imágenes:** Para estudiantes más jóvenes que aún no pueden leer bien, deja el "Texto de la pregunta" en blanco y solo usa una imagen. Haz la pregunta verbalmente y déjalos competir para encontrar la palabra escrita en las opciones.

**La regla de "Esperar":** Para evitar que los estudiantes hagan clic al azar para "vencer" al otro jugador, dile a la clase que si un estudiante hace clic en una respuesta incorrecta, también tiene que quedarse fuera en la siguiente pregunta. Esto fomenta la precisión sobre la velocidad pura.

**Modo de revisión:** Después del juego, usa el botón "Volver a configuración" para desplazarte rápidamente por las preguntas y revisar aquellas donde los estudiantes tuvieron dificultades, reforzando la lección antes de continuar.`
  },
  'quiz-config': {
    title: '📝 Guía de configuración',
    body: `### 📝 Juego de Quiz: Guía de configuración

#### 1. Construye tus preguntas

**Texto de la pregunta:** Escribe tu pregunta o indicación en el cuadro de texto.

**Agregar imágenes:** Haz clic en el icono de imagen para subir una imagen para la pregunta. Esto es genial para tareas de "¿Qué es esto?" o "Encuentra el [Color/Forma]".

**Administrar opciones:** Cada pregunta comienza con 2 opciones. Haz clic en "+ Agregar" para agregar hasta 4 opciones (A, B, C y D).

**Establecer la respuesta:** Haz clic en la burbuja de letra (A, B, C o D) junto a la elección correcta. Se volverá verde para mostrar que está guardada como la respuesta correcta.

**Agregar más:** Haz clic en "➕ Agregar pregunta" en la parte inferior para construir un quiz completo.

---

#### 2. Seleccionar los concursantes

¡Esta es una batalla cara a cara! Selecciona exactamente 2 estudiantes de tu lista de clase.

El jugador 1 será asignado verde y el jugador 2 será asignado rosa.

---

#### 3. Verificación de validación

El botón "Jugar" solo se desbloqueará una vez que todas tus preguntas tengan texto y una respuesta correcta seleccionada. Si una pregunta está incompleta, el juego la resaltará para que la arregles.`
  },
  'faceoff-game': {
    title: '🎮 Cómo jugar',
    body: `### 🎮 Cómo jugar

#### El objetivo
Sé el más rápido en emparejar la palabra en el centro con la imagen correcta en tu lado de la pantalla.

---

#### La pantalla de juego

La pantalla está dividida en dos mitades (una para cada jugador).

Una palabra objetivo (o imagen, dependiendo del modo) aparecerá en el centro mismo de la pantalla.

Varias imágenes diferentes aparecerán tanto en las áreas de jugador superior como inferior.

---

#### Cómo anotar

Ambos jugadores miran el objetivo central y compiten para encontrar la imagen coincidente en su propio lado.

**Toca/Haz clic en la imagen correcta:** Si tienes razón, ¡ganas la ronda y obtienes un punto!

**Ten cuidado:** Si haces clic en la imagen incorrecta, serás bloqueado por un momento mientras tu oponente tiene la oportunidad de encontrar la respuesta correcta.

---

#### Ganar el juego

El juego continúa por el número de rondas que elegiste durante la configuración.

Después de la ronda final, el jugador con más puntos es declarado ganador con una celebración de confeti.

Bonificación del profesor: Al igual que los otros juegos, puedes otorgar puntos de clase de bonificación al ganador directamente desde la pantalla de victoria antes de regresar al portal.

---

#### 📱 Móvil vs. Escritorio

**Versión de escritorio:** Se juega mejor en una pizarra inteligente o pantalla grande donde dos estudiantes pueden pararse a cada lado.

**Versión móvil:** Diseñada específicamente para tabletas o teléfonos, permitiendo que dos estudiantes se sienten uno frente al otro y jueguen en un solo dispositivo colocado plano sobre una mesa.`
  },
  'faceoff-config': {
    title: '⚔️ Guía de configuración',
    body: `### ⚔️ Face-Off: Guía de configuración

#### 1. Crea tus pares de palabra-imagen

Este juego usa pares de palabras e imágenes. Tienes dos formas de agregarlos:

**Carga masiva:** Arrastra y suelta un grupo de imágenes en el cuadro de carga. ¡El juego usará automáticamente los nombres de archivo como las palabras para cada imagen!

**Entrada manual:** Haz clic en "➕ Agregar par palabra-imagen" para agregar un espacio individual. Escribe la palabra y haz clic en el icono de imagen para subir una imagen específica para ella.

*(Nota: Necesitas al menos 5 pares para comenzar el juego.)*

---

#### 2. Elige tus rondas

Usa el control deslizante de rondas para decidir cuántas coincidencias jugarán los estudiantes (de 5 a 20 rondas).

---

#### 3. Selecciona tus competidores

¡Face-Off es una batalla cara a cara! Selecciona exactamente 2 estudiantes de tu lista de clase.

Un estudiante será asignado al lado verde y el otro al lado azul.

---

#### 4. Iniciar la batalla

Una vez que tengas 2 estudiantes seleccionados y al menos 5 pares listos, el botón rojo "Iniciar juego" se activará.`
  },
  'motorace-game': {
    title: '🏁 Cómo jugar',
    body: `### 🏁 Cómo jugar

#### El objetivo
¡Sé la primera motocicleta en cruzar la línea de meta a cuadros! La pista se divide automáticamente en pasos según cuántas palabras o imágenes agregaste durante la configuración.

---

#### Mostrar las preguntas

Haz clic en el botón "🖼️ Presentación" en la parte superior de la pantalla en cualquier momento.

Esto abre una vista masiva de pantalla completa de tu palabra o imagen actual para que toda la clase la vea.

Usa las flechas izquierda y derecha para navegar por tu material de lección a medida que avanza la carrera.

---

#### Mover las motocicletas

¡Tú eres el director de carrera! Controlas las motos según las respuestas de los estudiantes:

**Mover hacia adelante (¡Acelerar!):** ¿Un estudiante acertó la respuesta? Haz un solo clic (o toca) su motocicleta. Escucharás el motor rugir mientras hacen un caballito y avanzan un espacio.

**Mover hacia atrás (¡Derrapar!):** ¿Alguien cometió un error o necesitas emitir una penalización? Haz clic derecho (o doble toque) en su motocicleta para hacerlos derrapar hacia atrás un espacio.

---

#### Ganar la carrera

¡El primer jugador en llegar al paso final cruza la línea de meta y gana!

El juego se pausará instantáneamente y mostrará una pantalla gigante de celebración de campeón completa con confeti cayendo.

En la pantalla de victoria, puedes hacer clic para otorgar instantáneamente puntos de clase de bonificación (+1, +2, +3 o +5) al estudiante ganador antes de salir de la carrera.`
  },
  'motorace-config': {
    title: '🏍️ Guía de configuración',
    body: `### 🏍️ Juego MotoRace: Guía de configuración

#### 1. Elige tu tipo de contenido

Busca el interruptor Texto/Imagen en la parte superior.

**Modo texto:** Perfecto para ortografía, lectura o vocabulario. Escribe tus palabras en el cuadro (separadas por comas) y haz clic en Agregar.

**Modo imagen:** Genial para identificación visual. Haz clic en el área de carga o arrastra y suelta tus archivos de imagen para agregarlos al juego.

*(Nota: ¡Necesitas agregar al menos 2 palabras o imágenes para desbloquear el botón Iniciar!)*

---

#### 2. Selecciona tus corredores

**Número de jugadores:** Elige si quieres una carrera de 2, 3 o 4 jugadores.

**Elegir estudiantes:** Haz clic en los nombres de los estudiantes de tu lista de clase para asignarles una motocicleta colorida. Debes seleccionar el número exacto de estudiantes que elegiste en el paso anterior.

---

#### 3. Enciende tus motores
Una vez que tu contenido esté cargado y tus corredores estén seleccionados, ¡el botón naranja "Iniciar juego" en la parte inferior brillará. Haz clic en él para dirigirte a la línea de salida!`
  },
  'horserace-game': {
    title: '🏁 Cómo jugar',
    body: `### 🏁 Cómo jugar

#### El objetivo
¡Sé el primer caballo en correr desde la parte inferior de la pantalla hasta la línea de meta en la parte superior!

---

#### Enseñar con la presentación

Haz clic en el botón "🖼️ Presentación" en la parte superior para mostrar la palabra o imagen actual en un formato grande y claro para toda la clase.

Usa las flechas en pantalla para recorrer tu vocabulario mientras los estudiantes se turnan.

---

#### Controlar los caballos
El profesor actúa como árbitro y mueve los caballos según el rendimiento del estudiante:

**Mover hacia adelante (¡Galopar!):** Si un estudiante responde correctamente, haz un solo clic (o toca) su caballo. Se moverán un paso más cerca de la línea de meta con un sonido de galope.

**Mover hacia atrás (Tropezar):** Si un estudiante necesita una corrección o un "rehacer", haz clic derecho (o doble toque) en su caballo para moverlos hacia atrás un paso.

---

#### El círculo del ganador

El primer caballo en llegar a la parte superior de la pista gana.

El juego activará automáticamente una celebración de confeti y mostrará al ganador.

Puedes otorgar instantáneamente puntos de clase de bonificación (+1, +2, +3 o +5) al perfil del ganador directamente desde la pantalla de victoria.

---

#### 💡 Consejos del profesor para carrera de caballos

**La regla de "10 elementos":** Si solo tienes 5 palabras de vocabulario pero quieres una carrera más larga, ingresa cada palabra dos veces. Esto refuerza la memoria a través de la repetición y asegura que la carrera no termine demasiado rápido.

**Ejercicios de fonética:** Este juego es excelente para "Pares mínimos" (palabras que suenan similares como ship/sheep). Usa la presentación para alternar rápidamente entre ellas para ver si los estudiantes pueden detectar la diferencia.

**Gestionar la energía:** Debido a que los caballos se mueven verticalmente y la competencia es visible, ¡los estudiantes pueden ponerse ruidosos! Usa la mecánica de clic derecho (Mover hacia atrás) como una "penalización" suave para los estudiantes que gritan respuestas fuera de turno, fomentando una mejor disciplina en el aula.

**Ritmo dinámico:** Si un estudiante está muy adelante, puedes enfocar tus preguntas en los estudiantes rezagados para mantener la carrera "cabeza a cabeza", lo que mantiene un alto compromiso para toda la clase hasta el final.`
  },
  'horserace-config': {
    title: '🐎 Guía de configuración',
    body: `### 🐎 Carrera de caballos: Guía de configuración

#### 1. Prepara tu contenido de carrera

**Requisito mínimo:** Necesitas agregar al menos 10 elementos (palabras o imágenes) para comenzar la carrera. La longitud de la pista está determinada por cuántos elementos proporcionas.

**Modo texto:** Escribe palabras separadas por comas o nuevas líneas (ej., cat, bat, hat) y haz clic en Agregar.

**Modo imagen:** Arrastra y suelta imágenes directamente en el cuadro de carga.

*(Nota: El juego funciona mejor cuando tienes un elemento por cada "paso" que quieres que den los estudiantes.)*

---

#### 2. Elige tus jinetes

**Conteo de jugadores:** Selecciona si quieres una carrera de 2, 3 o 4 caballos.

**Asignar estudiantes:** Haz clic en los nombres de estudiantes de tu lista de clase para asignarlos a un carril de color. Debes seleccionar el número exacto de estudiantes para que coincida con tu conteo de jugadores.

---

#### 3. Dirígete a las pistas

Una vez que tengas al menos 10 elementos y tus estudiantes estén seleccionados, el botón dorado "Iniciar juego" se desbloqueará.`
  },
  'spelltheword-game': {
    title: '🎮 Cómo jugar',
    body: `### 🎮 Cómo jugar

#### El objetivo
Mira la imagen proporcionada y toca las letras mezcladas en el orden correcto para deletrear la palabra lo más rápido posible.

---

#### Deletrear las palabras

Aparece una imagen en el centro de la pantalla.

Se proporcionan fichas de letras mezcladas debajo de la imagen.

**Para deletrear:** Toca o haz clic en las letras en la secuencia correcta.

**Letra correcta:** La letra vuela al espacio de la palabra con una animación satisfactoria de "pop".

**Letra incorrecta:** La pantalla se sacudirá brevemente para que el estudiante sepa que debe probar una letra diferente.

**Saltar:** Si un estudiante está realmente atascado, puede presionar el botón "Saltar" para pasar a la siguiente palabra (no se otorgan puntos por palabras saltadas).

---

#### Ganar el juego

El juego continúa hasta que todas las palabras de tu lista hayan sido deletreadas.

El jugador con más palabras correctas al final gana la ronda.

**Puntos de clase:** Al igual que tus otros juegos, puedes otorgar puntos de clase de bonificación (+1, +2, +3 o +5) al ganador directamente desde la pantalla de victoria final.

---

#### 💡 Consejos del profesor para deletrear la palabra

**El truco del "Nombre de archivo limpio":** Antes de subir imágenes en masa, tómate un segundo para renombrarlas en tu computadora. Si quieres que los estudiantes deletreen "octopus", asegúrate de que el archivo no se llame "DSC10293.jpg". ¡Esto te ahorra tener que editar manualmente cada palabra en la pantalla de configuración!

**Dificultad escalonada:** Para principiantes, comienza con palabras CVC de 3 letras (cat, dog, bat). A medida que mejoren, pasa a palabras con "e silenciosa" o "dígrafos" (sh, ch, th). Debido a que el juego les proporciona las letras, es una excelente manera de "bajo riesgo" para practicar ortografías difíciles.

**Deletreo coral:** Mientras los dos estudiantes compiten en el pizarrón, anima al resto de la clase a deletrear la palabra en voz alta juntos una vez que esté terminada. Esto refuerza la conexión letra-sonido para todos, no solo para los jugadores.

**Enfócate en los fonemas:** Si un estudiante está atascado, en lugar de decirle la letra (ej., "Presiona la P"), dale el sonido (ej., "¿Cuál es el último sonido en 'Map'? /p/"). Esto les ayuda a usar su conocimiento de fonética para encontrar la ficha correcta.`
  },
  'spelltheword-config': {
    title: '🔠 Guía de configuración',
    body: `### 🔠 Deletrear la palabra: Guía de configuración

#### 1. Construye tu lista de palabras

**Requisito mínimo:** Debes agregar al menos 5 palabras para comenzar el juego.

**Carga masiva de imágenes:** Esta es la forma más rápida de configurar. Arrastra y suelta un grupo de imágenes en el cuadro de carga. ¡El juego tomará automáticamente los nombres de archivo de tus imágenes y los convertirá en las palabras objetivo (ej., una imagen llamada "apple.png" se convierte en la palabra "apple")!

**Entrada manual:** Usa la pestaña "Palabras" para escribir palabras específicas y subir imágenes coincidentes una por una.

**Procesamiento de texto:** Si tus nombres de archivo tienen guiones o guiones bajos (como "ice-cream"), el juego los limpiará automáticamente en palabras adecuadas.

---

#### 2. Elige el modo de desafío

**Modo 1 jugador:** Genial para práctica individual o tener un estudiante que venga al pizarrón mientras la clase lo ayuda.

**Modo 2 jugadores:** ¡Una carrera de deletreo cara a cara! Selecciona 2 estudiantes de tu lista de clase para competir. El jugador 1 es asignado verde y el jugador 2 es asignado rosa.

---

#### 3. Lanzar el concurso de deletreo

Una vez que tengas tus palabras y jugadores listos, el botón morado "Iniciar juego" se activará.`
  },
};

export const guideFr = {
  'landing': {
    title: 'Bienvenue sur Klasiz.fun',
    body: `### Choisissez votre portail

**Enseignants**
- Cliquez sur **Connexion** pour accéder au Portail Enseignant
- Cliquez sur **Commencer gratuitement** pour créer votre première classe

**Étudiants**
- Cliquez sur le rôle **Étudiant**
- Entrez le code à 5 chiffres de votre professeur
- Consultez et complétez les devoirs

**Parents**
- Cliquez sur le rôle **Parent**
- Entrez votre code parent à 5 chiffres
- Consultez le rapport de progrès de votre enfant

---

### Comment créer un compte enseignant

1. Cliquez sur **Commencer gratuitement** sur la page d'accueil
2. Remplissez votre email et créez un mot de passe
3. Vérifiez votre adresse email
4. Complétez la configuration de votre profil
5. Commencez à créer votre première classe !

---

### Connexion enseignant

1. Cliquez sur le bouton **Connexion** dans le coin supérieur droit
2. Entrez votre email et mot de passe
3. Cliquez sur **Se connecter** ou utilisez **Connexion Google** pour un accès rapide

### Mot de passe oublié

1. Cliquez sur **Connexion** puis **Mot de passe oublié ?**
2. Entrez votre adresse email
3. Vérifiez votre email pour le lien de réinitialisation du mot de passe
4. Créez un nouveau mot de passe et connectez-vous

---

### Connexion étudiant

**Comment les étudiants accèdent à leur compte**

1. Cliquez sur **Étudiant** sur la page d'accueil
2. Entrez le code d'accès à 5 chiffres de votre professeur
3. Pas besoin de mot de passe, juste le code !

**Ce que les étudiants peuvent faire**
- Voir les leçons et feuilles de travail assignées
- Compléter les devoirs et soumettre les réponses
- Suivre leur progrès et points gagnés
- Voir les annonces de classe du professeur

---

### Connexion parent

**Comment les parents voient le progrès**

1. Cliquez sur **Parent** sur la page d'accueil
2. Entrez le code parent unique à 5 chiffres
3. Consultez le progrès académique de votre enfant
4. Voyez les rapports détaillés et le suivi du comportement

**Ce que les parents peuvent voir**
- Performance académique et notes
- Rapports de comportement et commentaires
- Registres de présence
- Devoirs et statut de complétion
- Commentaires et notes de l'enseignant

---

### Aperçu des fonctionnalités

**Gestion de classe**
- Créez et gérez plusieurs classes
- Ajoutez des étudiants avec des codes simples à 5 chiffres
- Personnalisez les paramètres de classe et avatars

**Points et récompenses**
- Attribuez des points pour le bon comportement
- Système d'apprentissage gamifié
- Suivez les réalisations des étudiants

**Devoirs**
- Créez des feuilles de travail et des quiz
- Assignez aux étudiants ou classes entières
- Révisez et notez les soumissions
- Voir les analyses détaillées des soumissions

**Jeux et activités**
- Jeux de classe interactifs (Tornado, Memory Match)
- Outils de participation gamifiés
- Sélection aléatoire du gagnant
- Minuteur et buzzer pour les activités

**Rapports et analyses**
- Rapports détaillés de progrès des étudiants
- Suivi du comportement et commentaires
- Registres de présence
- Exporter les rapports en PDF

**Outils de classe**
- Tableau blanc numérique pour l'enseignement
- Minuteur à rebours pour les activités
- Buzzer d'attention pour concentrer la classe
- Partage de code QR pour un accès facile

---

### Questions fréquentes

**Klasiz.fun est-il gratuit ?**
Oui ! Les enseignants peuvent créer un compte gratuit et commencer à utiliser toutes les fonctionnalités principales.

**Comment ajouter des étudiants ?**
Dans le Tableau de Bord de Classe, cliquez sur l'icône des codes d'accès pour générer des codes uniques à 5 chiffres pour chaque étudiant.

**Les parents peuvent-ils suivre le progrès ?**
Oui ! Générez des codes d'accès parent dans le Tableau de Bord de Classe.

**Quels appareils fonctionnent avec Klasiz.fun ?**
Klasiz.fun fonctionne sur tout appareil avec un navigateur web : ordinateurs, tablettes et smartphones.

---

### Obtenir de l'aide

Cliquez sur l'icône bulle d'aide à tout moment pour obtenir des réponses rapides sur n'importe quelle fonctionnalité !

---

*Après la connexion, les enseignants voient leurs classes et peuvent cliquer sur n'importe quelle carte de classe pour entrer dans le Tableau de Bord.*`
  },
  'teacher-portal': {
    title: 'Portail Enseignant',
    body: `### Gérer les classes depuis le panneau latéral

Le Portail Enseignant utilise maintenant un panneau **Mes Classes** à gauche et l'espace de travail de la classe active à droite.

---

#### Bases du panneau de classes

- Cliquez sur n'importe quelle classe pour l'ouvrir dans l'espace de travail.
- Utilisez le **bouton flèche** en haut du panneau pour réduire ou étendre la liste de classes.
- Sur mobile, toucher en dehors du panneau le ferme automatiquement.
- Utilisez le **glisser-déposer** dans le panneau pour réorganiser les classes.

---

#### Ajouter / Modifier / Supprimer une classe

**Ajouter**
- Cliquez sur le bouton **+ Ajouter une nouvelle classe** dans le panneau.
- Entrez le nom de la classe, choisissez le style d'avatar ou téléchargez votre propre image.
- Choisissez la couleur d'arrière-plan du tableau de bord et enregistrez.

**Modifier**
- Utilisez le **menu ⋮** sur la ligne de la classe, puis choisissez **Modifier la classe**.

**Supprimer**
- Utilisez le **menu ⋮** sur la ligne de la classe, puis choisissez **Supprimer la classe** et confirmez.

---

#### Outils de l'espace de travail

- Développez **Outils de l'espace de travail** pour ouvrir le **Planificateur de leçons**.
- Utilisez **Exporter sauvegarde** pour télécharger votre sauvegarde JSON des données de classe.

---

*Les mises à jour de classe et les changements d'ordre sont sauvegardés automatiquement.*`
  },
  'class-dashboard': {
    title: 'Tableau de Bord de Classe',
    body: `### Votre centre de commande de classe

Utilisez cette page pour gérer les points, la présence, les étudiants, les devoirs, les rapports et les outils de classe.

---

#### Navigation principale (Dock / Barre latérale)

Selon la mise en page, les outils apparaissent dans une barre latérale gauche ou un dock inférieur.

| Icône | Ce qu'il ouvre |
|---|---|
| 📋 | Devoirs |
| 💬 | Boîte de réception / notation |
| 👥 | Mode de présence |
| 🔳 | Codes d'accès étudiants et parents |
| 📊 | Rapports |
| 🎨 | Tableau blanc |
| ⚙️ | Paramètres des cartes de points |
| 🎮 | Centre de jeux |

---

#### Barre d'outils supérieure

- **Historique** : voir l'historique des points de la classe.
- **Trier** : Nom (A-Z) ou Points les plus élevés.
- **Taille d'affichage** : Compact, Régulier, Spacieux.
- **Plein écran** : afficher ou quitter le plein écran.
- **Sélection multiple** : sélectionnez plusieurs étudiants, puis attribuez un comportement à tous.

---

#### Donner des points

**Étudiant individuel**
- Cliquez sur une carte d'étudiant, puis choisissez une carte de comportement.

**Toute la classe**
- Cliquez sur la carte **Toute la Classe** et choisissez un comportement.
- Seuls les étudiants présents sont inclus dans les récompenses de classe.

**Sélection multiple**
- Activez la sélection multiple depuis la barre d'outils.
- Touchez les cartes d'étudiants pour sélectionner.
- Cliquez sur **Donner des Points** et choisissez un comportement.

---

#### Mode de présence

- Activez le mode de présence depuis la navigation.
- Touchez les étudiants pour marquer absent/présent.
- Les étudiants absents sont exclus des récompenses de classe.

---

#### Gestion des étudiants

- **Ajouter un étudiant** depuis la tuile à la fin de la grille.
- **Modifier/Supprimer** en survolant une carte d'étudiant sur bureau, ou en appuyant longuement sur les appareils tactiles.

---

#### Changement de classe

- Utilisez le sélecteur de classe dans l'en-tête du tableau de bord pour naviguer rapidement entre les classes.

---

*Les modifications des points, de la présence, des étudiants et des paramètres sont sauvegardées automatiquement.*`
  },
  'assignments': {
    title: 'Devoirs',
    body: `### Créer et publier des feuilles de travail

**Étape 1 : Entrez les détails du devoir**
- Tapez un titre pour votre feuille de travail
- Ajoutez des questions en utilisant le panneau droit

---

#### Types de questions

| | |
|---|---|
| 📝 | Réponses en texte libre |
| ☑️ | Les étudiants choisissent parmi les options |
| 🔤 | Tapez \`[blank]\` où vont les réponses |
| ↔️ | Associez les éléments de gauche à droite |
| 📖 | Incluez un passage avec des questions |
| ✅ | Réponses simples vrai ou faux |
| 🔢 | Nombres uniquement |
| ↕️ | Glissez les parties pour réorganiser les phrases |
| 📊 | Catégorisez les éléments en groupes |

---

**Étape 2 : Ajouter des questions**
- Cliquez sur un bouton de type de question dans le panneau droit
- Tapez votre question
- **Ajouter des images :** Cliquez sur l'icône d'image dans une question
- **Supprimer des questions :** Cliquez sur l'icône de corbeille à côté d'une question

---

**Étape 3 : Assigner et publier**
- Choisissez qui reçoit le devoir :
  - **Tous les étudiants** - tout le monde dans la classe
  - **Sélectionner des étudiants** - choisissez des étudiants spécifiques
- Cliquez sur **Publier dans la classe**

---

*Les questions vides ne peuvent pas être publiées. Remplissez d'abord les champs requis.*`
  },
  'inbox': {
    title: 'Messages et Notation',
    body: `### Réviser et noter les soumissions des étudiants

---

#### Deux sections

**En attente de révision**
- Ce sont de nouvelles soumissions d'étudiants
- Cliquez sur n'importe quelle soumission pour voir les réponses
- Entrez une note et cliquez sur sauvegarder

**Récemment notés**
- Ce sont des soumissions que vous avez déjà notées
- Cliquez pour revoir ce que vous avez donné
- Peut re-noter si nécessaire

---

#### Processus de notation

1. Cliquez sur une soumission de la liste d'attente
2. Voir les réponses de l'étudiant dans le panneau gauche
3. Entrez des points/note dans le champ
4. Cliquez sur l'icône ✅ pour sauvegarder
5. La note est ajoutée au score total de l'étudiant
6. La soumission passe à "Récemment notés"

---

#### Re-notation

Si vous devez changer une note :
- Cliquez à nouveau sur la soumission
- Entrez la nouvelle note
- Cliquez sur sauvegarder
- Seule la différence est ajoutée/soustraite

---

#### Quitter

Cliquez sur le **X** ou le bouton fermer pour retourner au tableau de bord.

---

*Le badge sur l'icône des messages montre combien de soumissions attendent la révision.*`
  },
  'settings': {
    title: 'Paramètres',
    body: `### Configurer les cartes de points

Configurez les cartes de points : **Ajouter**, **Modifier**, **Supprimer des cartes**

#### Cartes de points

Ce sont les récompenses et pénalités que vous donnez aux étudiants.

**Voir**
- Chaque carte montre :
  - Icône emoji
  - Nom de la carte (ex. "Excellent Travail")
  - Type (WOW pour positif, NO NO pour négatif)
  - Valeur en points (+1, +2, -1, etc.)

**Ajouter une carte**
- Cliquez sur **Ajouter Carte** (➕) dans l'en-tête
- Entrez le nom de la carte
- Choisissez un emoji dans le sélecteur de stickers
- Définissez la valeur en points (positif ou négatif)
- Cliquez sur sauvegarder

**Modifier une carte**
- Cliquez sur l'icône ✏️ (crayon) sur n'importe quelle carte
- Changez le nom, l'emoji ou les points
- Cliquez sur l'icône de sauvegarde (✅)

**Supprimer une carte**
- Cliquez sur l'icône 🗑️ (corbeille) sur n'importe quelle carte
- Confirmez la suppression

---

#### Réinitialiser par défaut
- Cliquez sur **Réinitialiser** (🔄) pour restaurer l'ensemble original de cartes de points
- Cela remplace toutes vos cartes personnalisées

---

*Les modifications sont sauvegardées automatiquement pour toutes vos classes.*`
  },
  'access-codes': {
    title: "Codes d'Accès",
    body: `### Codes de connexion pour étudiants et parents

Chaque étudiant a deux codes à 5 chiffres :

| Type de code | Utilisé par | Objectif |
|------------|-----------|---------|
| Code étudiant | Étudiants | Se connecter au Portail Étudiant et compléter les devoirs |
| Code parent | Parents | Voir les rapports et le progrès de leur enfant |

---

#### Codes QR

Chaque code est aussi affiché comme un code QR.

**Scanner un code QR**
- Pointez la caméra de votre téléphone/tablette vers le code QR
- Se connecte automatiquement au bon portail
- Pas besoin de taper !

**Copier un code QR**
- Cliquez sur le bouton **Copier QR** à côté de n'importe quel étudiant
- Le code QR est sauvegardé dans votre presse-papiers comme image
- Collez dans des emails, documents ou imprimez pour partager

---

#### Codes générés

- Les codes sont créés automatiquement quand cette page s'ouvre
- Chaque étudiant reçoit des codes uniques
- Les codes sont permanents et ne changent pas

---

#### Copier le code texte

- Cliquez sur n'importe quel code à 5 chiffres pour le copier
- Donnez le code au parent ou à l'étudiant
- Ils l'entrent sur l'écran de connexion

---

*Les parents ne peuvent voir que les données de leur propre enfant. Les étudiants ne peuvent voir que les devoirs qui leur sont envoyés.*`
  },
  'whiteboard': {
    title: 'Tableau Blanc',
    body: `### Dessinez, écrivez et partagez

Le tableau blanc est une toile vierge pour les activités de classe.

---

#### Outils de dessin (côté droit)

| | |
|---|---|
| ✏️ Crayon | Dessinez librement sur la toile |
| 🖍️ Surligneur | Superposition de couleur transparente |
| 📝 Texte | Tapez du texte et appuyez sur Entrée pour placer |
| 🧹 Gomme | Supprimez les dessins |
| 😊 Emoji | Tamponnez des emojis sur le tableau |

---

#### Options de la toile

**Sélecteur de couleurs**
- 10 couleurs prédéfinies disponibles
- Cliquez sur n'importe quelle couleur pour sélectionner

**Taille de ligne/trait**
- Ajustez l'épaisseur de vos lignes
- Utilisez le curseur ou les boutons

**Options de police**
- Famille : Moderne, Amusante, Élégante, Machine à écrire, Gras
- Taille : Rendez le texte plus grand ou plus petit

**Ajouter des images**
- Cliquez sur l'icône d'image
- Téléchargez des photos depuis votre appareil
- Redimensionnez et positionnez selon vos besoins

---

#### Actions

**Exporter PNG**
- Cliquez pour télécharger le tableau blanc comme image
- Sauvegardez n'importe où sur votre ordinateur
- Partagez avec les étudiants plus tard

**Effacer la toile**
- Cliquez sur l'icône de corbeille
- Efface tout le tableau

---

*Utilisez le tableau blanc pour les problèmes de mathématiques, diagrammes, remue-méninges ou toute leçon visuelle.*`
  },
  'student-portal': {
    title: 'Portail Étudiant',
    body: `### Complétez les devoirs et gagnez des points

Les étudiants se connectent avec un code à 5 chiffres pour voir leur travail.

---

#### Connexion

1. Entrez votre code étudiant à 5 chiffres (de votre professeur)
2. Cliquez sur **Connexion**

---

#### Devoirs

Vous verrez tous les devoirs de votre professeur :

**Non complétés** (affichés en premier)
- Du plus récent au plus ancien
- Ceux-ci vous attendent
- Cliquez pour ouvrir et compléter

**Complétés** (affichés en dessous)
- Du plus récent au plus ancien
- Déjà terminés
- Peuvent être masqués (cliquez sur le bouton masquer)

---

#### Compléter un devoir

1. Cliquez sur n'importe quel devoir non complété
2. Répondez à toutes les questions
3. Cliquez sur **Soumettre**
4. Votre travail est envoyé à votre professeur
5. Vous recevrez votre note bientôt !

---

#### Vos statistiques

En haut de la page, vous pouvez voir :
- **Points totaux** - Tous les points que vous avez gagnés
- **Complétés** - Nombre de devoirs faits
- **À faire** - Devoirs qui vous attendent

---

*Rafraîchissez la page si votre professeur vient d'envoyer un nouveau devoir.*`
  },
  'parent-portal': {
    title: 'Portail Parent',
    body: `### Voir le progrès de votre enfant

Les parents utilisent un code à 5 chiffres pour voir les informations de leur enfant.

---

#### Connexion

1. Entrez votre code parent à 5 chiffres (du professeur de votre enfant)
2. Cliquez sur **Connexion**

---

#### Ce que vous verrez

- Le total de points actuel de votre enfant
- Graphique de comportement quotidien
- Répartition du comportement (positif vs à améliorer)
- Commentaires de l'enseignant générés par IA
- Registres de présence

---

#### Périodes

Changez la vue pour voir les données de :
- Cette semaine
- Ce mois
- Cette année

---

#### Langue

Basculez entre les langues pour changer la langue du rapport.

---

*Votre accès est en lecture seule. Seuls les enseignants peuvent apporter des modifications.*`
  },
  'lesson-planner': {
    title: 'Planificateur de Leçons',
    body: `### Planifiez vos leçons

Créez et organisez des leçons avec des calendriers et des modèles.

---

#### Commencer

**Ouvrir le Planificateur de Leçons**
- Depuis le Portail Enseignant, cliquez sur **Planificateur de Leçons** (ou l'icône de calendrier)
- Vous verrez votre vue mensuelle et tous les modèles sauvegardés

**Vue mensuelle**
- Voyez tous les jours du mois d'un coup d'œil
- Cliquez sur un jour pour ajouter ou modifier des leçons
- Utilisez les flèches pour changer de mois

---

#### Modèles

**Utiliser un modèle**
- Choisissez un modèle pour structurer votre semaine ou journée
- Remplissez les matières et activités
- Sauvegardez pour appliquer le plan à votre calendrier

**Créer le vôtre**
- Construisez des modèles personnalisés pour votre emploi du temps
- Réutilisez-les sur des semaines ou des mois

---

#### Conseils

- Planifiez à l'avance pour tout le mois
- Dupliquez une semaine pour gagner du temps
- Exportez ou imprimez votre plan si nécessaire

---

*Les plans de leçons sont sauvegardés automatiquement.*`
  },
  'games': {
    title: 'Jeux',
    body: `### Jeux de classe

Jouez à des jeux amusants avec votre classe : Tornado, Memory Match, Quiz et plus.

---

#### Ouvrir les jeux

**Depuis le portail**
- Sur le Portail Enseignant, cliquez sur **Jeux** (ou l'icône de manette de jeu)
- Choisissez un jeu dans la liste

**Depuis le tableau de bord**
- Certains jeux peuvent être lancés depuis la barre latérale du tableau de bord
- Lucky Draw est dans la barre latérale ; les jeux complets s'ouvrent depuis le portail

---

#### Types de jeux

**Tornado**
- Faites tourner la roue pour choisir des étudiants ou des options
- Idéal pour la sélection aléatoire et les récompenses

**Memory Match**
- Retournez les cartes pour trouver des paires
- Utilisez vos propres images ou ensembles par défaut

**Quiz**
- Choix multiple ou réponse courte
- Ajoutez vos propres questions

**Autres**
- Face Off, Course de Motos, Course de Chevaux, Épeler le Mot et plus
- Chaque jeu a ses propres règles et configuration

---

#### Pendant le jeu

- Mode plein écran pour l'affichage en classe
- Utilisez le bouton retour pour revenir à la liste des jeux ou au portail

---

*Les jeux fonctionnent mieux quand toute la classe peut voir l'écran.*`
  },
  'reports': {
    title: 'Rapports',
    body: `### Voir le progrès et l'analyse des étudiants

Cette page affiche des rapports détaillés et des analyses pour vos étudiants.

---

#### Périodes

Changez la plage de temps pour voir les données :
- **Semaine** - 7 derniers jours
- **Mois** - 30 derniers jours
- **Année** - 12 derniers mois

---

#### Sélection d'étudiant

Voir les rapports pour tous les étudiants ou en sélectionner un :
- Utilisez le menu déroulant pour filtrer un étudiant spécifique
- Chaque étudiant montre sa propre fiche de rapport

---

#### Contenu de la fiche de rapport

Chaque rapport d'étudiant comprend :

**Informations de l'étudiant**
- Nom et ID de l'étudiant
- Avatar ou image de personnage
- Total des points gagnés

**Commentaires de l'enseignant par IA**
- Résumé généré automatiquement
- Met en évidence les forces et les domaines à améliorer
- Basé sur les schémas de comportement
- L'enseignant peut modifier (cliquez sur le bouton modifier)

**Graphique de distribution du comportement**
- Points quotidiens pour la période sélectionnée
- Graphique à barres montrant les tendances des points
- Comportements positifs affichés en vert
- Comportements à améliorer affichés en rouge

---

#### Options d'exportation

**Télécharger PDF**
- Cliquez sur le bouton PDF (coin supérieur droit)
- Télécharge le rapport en fichier PDF
- Inclut tous les graphiques et données
- Prêt pour l'impression ou le partage

---

*Les rapports aident les enseignants à suivre le progrès des étudiants et à communiquer avec les parents.*`
  },
  'liveworksheet-config': {
    title: '📄 Guide de configuration',
    body: `### 📄 Feuille de travail en direct : Guide de configuration

#### 1. Téléchargez votre matériel

**Formats pris en charge :** Vous pouvez télécharger des fichiers PDF ou des documents Microsoft Word (.docx).

**Comment télécharger :** Faites glisser votre fichier directement dans la zone de téléchargement ou cliquez sur l'icône "Parcourir" pour sélectionner un fichier depuis votre ordinateur.

**Extraction automatique :** Une fois téléchargé, l'outil analysera automatiquement le document et tentera d'extraire le texte et d'identifier les questions potentielles.

---

#### 2. Réviser et modifier les questions

**Liste de questions :** Les questions extraites apparaîtront dans une liste. Si l'outil identifie un format spécifique (comme choix multiples), il le catégorisera automatiquement.

**Ajustements manuels :** Vous pouvez modifier le texte de la question, ajouter ou supprimer des options et sélectionner la bonne réponse.

**Types de questions :** Vous pouvez changer le type de n'importe quelle question à l'aide du menu déroulant. Les options incluent :

**Choix multiples :** Format standard A/B/C/D.

**Remplir les blancs :** Les étudiants tapent le mot manquant.

**Vrai/Faux :** Vérification rapide de la compréhension.

**Correspondance et tri :** Tâches interactives par glisser-déposer.

**Compréhension :** Idéal pour les histoires plus longues suivies de plusieurs questions.

---

#### 3. Ajouter un nouveau contenu

Si l'extraction a manqué une question ou si vous souhaitez en ajouter davantage, cliquez sur le bouton "➕ Ajouter une question" en bas de la liste pour en créer une nouvelle à partir de zéro.`
  },
  'liveworksheet-game': {
    title: '🛠️ Comment gérer',
    body: `### 🛠️ Comment gérer votre feuille de travail

#### Organiser le flux

**Réorganiser :** Utilisez les flèches haut et bas sur chaque carte de question pour changer l'ordre dans lequel elles apparaissent aux étudiants.

**Supprimer :** Utilisez l'icône de corbeille pour supprimer tout texte inutile ou questions incorrectement identifiées qui ont été capturées pendant le processus d'extraction.

---

#### La vérification finale

En bas de l'écran, l'outil suit vos questions valides. Une question est considérée comme valide une fois qu'elle a une invite, des options (si nécessaire) et une réponse correcte désignée.

Vous ne pouvez attribuer la feuille de travail qu'une fois qu'au moins une question est entièrement validée.

---

#### Finaliser le devoir

**Jouer maintenant :** Cela lance la feuille de travail immédiatement en "Mode classe" pour une activité en direct au tableau.

**Attribuer :** Cela envoie la feuille de travail à votre portail étudiant, permettant aux étudiants de la compléter sur leurs propres appareils.

---

#### 💡 Conseils d'enseignant pour les feuilles de travail numériques

**Les documents propres fonctionnent mieux :** Pour l'extraction la plus précise, essayez d'utiliser des documents avec des en-têtes clairs et des questions numérotées. Si un PDF n'est qu'une image (comme une photo d'une page), l'extraction de texte peut ne pas fonctionner ; assurez-vous que le PDF contient du texte sélectionnable.

**Échafaudage avec le mode "Compréhension" :** Lors de l'utilisation du type Histoire/Compréhension, gardez le passage de texte concis. La lecture numérique peut être plus fatigante que la lecture sur papier, donc diviser les histoires plus longues en deux feuilles de travail plus petites peut aider à maintenir la concentration des étudiants.

**Mélanger les types de questions :** Pour prévenir la "fatigue des clics", mélangez votre feuille de travail avec différents types. Suivez quelques questions "Choix multiples" avec une tâche "Tri" ou "Classement" pour garder les étudiants cognitivement engagés avec différents styles d'interaction.

**Le pouvoir de "Remplir les blancs" :** Pour la pratique de l'orthographe et de la grammaire, utilisez le type "Blanc". Cela oblige les étudiants à produire la langue plutôt que de simplement la reconnaître, ce qui en fait une évaluation plus rigoureuse de leur capacité d'écriture réelle.

**Retour immédiat :** Étant donné que cet outil numérise la feuille de travail, les étudiants obtiennent un retour instantané sur leurs réponses lors de la lecture en direct. Utilisez le mode "Jouer maintenant" pour parcourir une feuille de travail ensemble après qu'ils aient terminé, en vous concentrant sur les questions où la plupart des étudiants ont fait des erreurs.`
  },
  'Messages & Grading': {
    title: 'Boîte de réception — Réviser les soumissions',
    body: `### Noter le travail des étudiants

**Voir les soumissions**
- Cliquez sur l'icône 💬 (messages) dans la barre latérale
- Deux sections apparaissent :
  - **En attente de révision** - soumissions nécessitant des notes
  - **Récemment notées** - révisions terminées

---

**Noter une soumission**
1. Cliquez sur n'importe quelle soumission dans la liste d'attente
2. Voir les réponses de l'étudiant à gauche
3. Entrez les points/note dans le champ de saisie
4. Cliquez sur l'icône ✅ (vérifier) pour enregistrer

---

**Ce qui se passe après la notation**
- La soumission passe à "Récemment notées"
- La note est ajoutée au score total de l'étudiant
- Si vous renotez, seule la différence est ajoutée

---

**Quitter la boîte de réception**
- Cliquez sur le bouton fermer (X) pour revenir au tableau de bord

---

*Utilisez le bouton actualiser si les étudiants viennent de soumettre un nouveau travail.*`
  },
  'settings-cards': {
    title: 'Cartes de points',
    body: `### Configurer les cartes de points

**Ajouter**, **Modifier**, **Supprimer des cartes**

#### Cartes de points

Créez des cartes personnalisées pour récompenser des comportements spécifiques :

**Ajouter une nouvelle carte**
- Cliquez sur "➕ Ajouter une carte"
- Entrez le nom du comportement
- Définissez la valeur des points (+positif ou -négatif)
- Choisissez une couleur pour la carte
- Cliquez sur enregistrer

**Modifier la carte**
- Cliquez sur n'importe quelle carte existante
- Modifiez le nom, les points ou la couleur
- Enregistrez les modifications

**Supprimer la carte**
- Cliquez sur l'icône de corbeille sur la carte
- Confirmez la suppression

---

*Les cartes de points apparaissent dans le tableau de classe pour un suivi rapide du comportement.*`
  },
  'games-config': {
    title: 'Configuration des jeux',
    body: `### Configurer les jeux

Chaque jeu a son propre écran de configuration avec des options spécifiques.

#### Étapes communes

1. **Sélectionner les joueurs**
   - Choisissez des étudiants individuels ou des équipes
   - Certains jeux nécessitent exactement 2 joueurs
   - D'autres permettent jusqu'à 4 joueurs ou équipes

2. **Ajouter du contenu**
   - Téléchargez des images
   - Entrez des mots de vocabulaire
   - Créez des questions et des réponses

3. **Configurer les options**
   - Ajustez la difficulté
   - Définissez le nombre de tours
   - Choisissez des thèmes ou des couleurs

4. **Démarrer le jeu**
   - Le bouton "Démarrer le jeu" se déverrouille lorsque tout est prêt
   - Cliquez pour lancer le jeu en plein écran

---

**Tornado**
- Ajoutez des mots et des images
- Choisissez le nombre de tuiles
- Décidez combien de tornades inclure

**Memory Match**
- Téléchargez des paires d'images ou de mots
- Sélectionnez 1-4 joueurs
- Choisissez un thème de couleur

**Quiz**
- Ajoutez des questions et des options
- Définissez la bonne réponse
- Sélectionnez exactement 2 étudiants

---

*Changez toujours la configuration avant de commencer le jeu.*`
  },
  'tornado-game': {
    title: '🌪️ Comment jouer',
    body: `### 🎮 Comment jouer

#### L'objectif
Alternez pour retourner les tuiles et collecter le plus de points. Mais attention—trouver une tornade fera s'envoler tous vos points !

---

#### Prendre son tour

Cherchez le badge "🎯 VOTRE TOUR ! 🎯" pour voir à qui c'est le tour.

L'étudiant ou l'équipe doit répondre à une question, lire un mot ou identifier une image du tableau avant d'être autorisé à choisir une tuile.

Cliquez sur n'importe quelle tuile non révélée pour la retourner et voir ce qu'il y a dessous. Le jeu passera automatiquement le tour au joueur suivant après qu'une tuile soit retournée.

---

#### Types de cartes

**Points (+1 à +10) :** Ajoute des points standard à votre score.

**Double (x2) :** Une trouvaille chanceuse ! Multiplie la valeur cachée de la carte par 2.

**Triple (x3) :** Une trouvaille super chanceuse ! Multiplie la valeur cachée de la carte par 3.

**Tornade (🌪️) :** Attention ! Si vous retournez ceci, une animation de tornade tourne sur l'écran et votre score tombe exactement à 0.

---

#### Contrôles de l'enseignant (Ajustements manuels)

Un étudiant a donné une réponse exceptionnellement bonne, ou avez-vous besoin de corriger une erreur ? Vous pouvez ajuster manuellement le score de n'importe quel joueur à tout moment en cliquant sur les boutons + ou - situés sur leur panneau de joueur.

---

#### Gagner le jeu

Le jeu se termine lorsque chaque tuile du tableau a été retournée.

Le joueur ou l'équipe avec le score le plus élevé est couronné gagnant avec une célébration de confettis amusante !

Sur l'écran de victoire, vous avez la possibilité d'attribuer instantanément des points de classe bonus (+1, +2, +3 ou +5) à l'étudiant ou à l'équipe gagnante avant de rejouer.`
  },
  'tornado-config': {
    title: '🌪️ Guide de configuration',
    body: `### 🌪️ Jeu Tornado : Guide de configuration

#### 1. Choisissez vos joueurs

**Mode individuel :** Sélectionnez des étudiants spécifiques pour jouer les uns contre les autres (minimum 2, maximum 4 joueurs).

**Mode équipe :** Divisez la classe en 2, 3 ou 4 équipes. Le jeu triera automatiquement votre classe sélectionnée en groupes avec leurs propres couleurs d'équipe amusantes.

---

#### 2. Configurer le plateau de jeu

**Nombre de tuiles :** Utilisez le curseur pour choisir combien de tuiles apparaîtront sur le plateau, d'un jeu rapide de 10 tuiles à un plateau massif de 40 tuiles.

**Tuiles numérotées :** Activez ceci pour afficher des numéros au dos des cartes (idéal pour que les étudiants appellent le numéro qu'ils veulent). Désactivez-le pour afficher une icône d'étoile à la place.

**Nombre de tornades :** Décidez à quel point le plateau est dangereux ! Choisissez exactement combien de cartes Tornade sont cachées (1 à 5), ou sélectionnez "Aléatoire" pour garder tout le monde en train de deviner.

---

#### 3. Ajoutez votre contenu de leçon

**Télécharger des images :** Cliquez ou glissez-déposez jusqu'à 20 fichiers image dans la boîte de téléchargement. Le jeu affichera ceux-ci autour du plateau.

**Entrer des mots :** Tapez des mots de vocabulaire séparés par des virgules (par ex., pomme, chat, chien) et cliquez sur Ajouter. Ceux-ci seront encadrés autour du plateau de jeu à côté de vos images pour inciter les étudiants pendant le jeu.

---

#### 4. Démarrer le jeu
Une fois que vos joueurs sont sélectionnés et que votre contenu est chargé, le bouton brillant "Démarrer le jeu" en bas de l'écran se déverrouillera.`
  },
  'memorymatch-game': {
    title: '🎮 Comment jouer',
    body: `### 🎮 Comment jouer

#### L'objectif
Trouvez et associez toutes les paires cachées derrière les cartes. Le joueur avec le plus de correspondances à la fin du jeu gagne !

---

#### Prendre son tour

Le panneau de score du joueur actif brillera ou pulsera, indiquant que c'est son tour.

Un joueur clique sur deux cartes pour les retourner.

**Si elles correspondent :** Les cartes restent visibles (ou disparaissent), le joueur gagne un point et peut rejouer.

**Si elles ne correspondent pas :** Les cartes trembleront brièvement puis se retourneront. Le tour passe ensuite au joueur suivant.

---

#### Gagner le jeu

Le jeu se termine lorsque toutes les paires ont été trouvées avec succès.

Un écran de champion apparaîtra avec des confettis, mettant en évidence le(s) gagnant(s).

Bonus enseignant : Depuis l'écran de victoire, vous pouvez attribuer instantanément des points de classe (+1, +2, +3 ou +5) au profil numérique du gagnant.

---

#### 💡 Conseils d'enseignant pour Memory Match

**Correspondance échafaudée (Image à mot) :** Pour les jeunes apprenants ou le nouveau vocabulaire, utilisez une configuration Image à texte. Cela oblige l'étudiant à connecter le concept visuel avec l'orthographe écrite, ce qui est plus exigeant cognitivement (et gratifiant) que la simple correspondance image à image.

**La règle de "Réponse chorale" :** Pour garder toute la classe engagée pendant une correspondance 1 contre 1, faites dire le mot à haute voix à toute la classe chaque fois qu'une carte est retournée. Cela garantit que même les étudiants qui ne jouent pas actuellement pratiquent leur prononciation.

**Déclencheurs de mémoire intentionnels :** Si un étudiant retourne une carte et rate une correspondance, demandez-lui de décrire l'emplacement (par ex., "Où était la 'Pomme' ? En haut à gauche !"). Cela encourage l'utilisation du langage positionnel (haut, bas, gauche, droite) aux côtés du vocabulaire de la leçon.

**Ajuster la difficulté :** Si le jeu avance trop lentement, vous pouvez réduire le nombre de paires dans la configuration. Pour les étudiants avancés, augmentez la taille de la grille pour tester leur mémoire spatiale à court terme et leur concentration.

**Mode collaboratif :** Bien que le jeu suive les scores individuels, vous pouvez le traiter comme un défi "Classe contre la montre". Faites travailler les étudiants ensemble pour trouver toutes les correspondances en moins de deux minutes pour gagner une récompense de groupe.`
  },
  'memorymatch-config': {
    title: '🧠 Guide de configuration',
    body: `### 🧠 Memory Match : Guide de configuration

#### 1. Chargez votre contenu de leçon

**Éléments de contenu :** Vous pouvez ajouter du vocabulaire de deux manières :

**Texte :** Tapez un mot et cliquez sur Ajouter. Cela crée une carte basée sur du texte.

**Images :** Glissez-déposez des images dans la zone de téléchargement. Celles-ci apparaîtront comme des cartes visuelles.

**Créer des paires :** Le jeu duplique automatiquement vos éléments pour créer des paires, ou vous pouvez mélanger et assortir des images avec leurs mots correspondants pour créer des défis "Image à texte".

*(Note : Vous avez besoin d'au moins 2 éléments pour commencer, mais pour un défi standard, 6 à 12 éléments sont recommandés.)*

---

#### 2. Sélectionner les concurrents

**Sélection de joueurs :** Choisissez entre 1 et 4 joueurs.

**Attribuer des étudiants :** Sélectionnez des étudiants dans votre liste de classe. Chaque étudiant se verra attribuer une couleur unique et un suivi de score dédié en haut de l'écran.

---

#### 3. Choisir un thème

Choisissez une couleur de fond (Bleu ciel, Vert pâle, Rose clair ou Mocassin) pour définir l'ambiance de la session.

---

#### 4. Lancer le plateau

Une fois que vos étudiants sont sélectionnés et que le contenu est prêt, cliquez sur le bouton "Démarrer le jeu" pour générer la grille.`
  },
  'quiz-game': {
    title: '🎮 Comment jouer',
    body: `### 🎮 Comment jouer

#### L'objectif
Soyez le premier à cliquer sur la bonne réponse de votre côté de l'écran.

---

#### L'écran de bataille

L'écran est divisé en deux côtés identiques. La question et l'image apparaissent au centre pour que les deux joueurs les voient.

Lorsqu'une question apparaît, les deux étudiants se précipitent pour trouver la bonne option de leur propre côté.

---

#### Score et résultats

**Bonne réponse :** Le premier joueur à cliquer sur le bon choix obtient le point. Le jeu affichera une coche verte et passera automatiquement à la question suivante.

**Mauvaise réponse :** Si un joueur clique sur le mauvais bouton, il est brièvement verrouillé, donnant à son adversaire une chance de répondre.

---

#### Victoire et récompenses

Une fois que toutes les questions sont terminées, les scores finaux sont affichés.

**Points de classe :** Vous pouvez attribuer instantanément des points bonus (+1, +2, +3 ou +5) au profil numérique du gagnant directement depuis l'écran du trophée.

---

#### 💡 Conseils d'enseignant pour le jeu Quiz

**Distracteurs efficaces :** Lors de l'enseignement de la phonétique, utilisez des options qui se ressemblent ou sonnent de manière similaire (par ex., Question : "Ship" | Options : Sheep, Ship, Chip, Shop). Cela oblige les étudiants à regarder de près les graphèmes plutôt que de simplement deviner.

**Invites avec images uniquement :** Pour les jeunes apprenants qui ne peuvent pas encore bien lire, laissez le "Texte de la question" vide et utilisez uniquement une image. Posez la question verbalement et laissez-les se précipiter pour trouver le mot écrit dans les options.

**La règle "Attendre" :** Pour empêcher les étudiants de cliquer au hasard pour "battre" l'autre joueur, dites à la classe que si un étudiant clique sur une mauvaise réponse, il doit également rester assis pour la question suivante. Cela encourage la précision plutôt que la vitesse pure.

**Mode révision :** Après le jeu, utilisez le bouton "Retour à la configuration" pour parcourir rapidement les questions et réviser celles où les étudiants ont eu des difficultés, renforçant la leçon avant de continuer.`
  },
  'quiz-config': {
    title: '📝 Guide de configuration',
    body: `### 📝 Jeu Quiz : Guide de configuration

#### 1. Construisez vos questions

**Texte de la question :** Tapez votre question ou invite dans la zone de texte.

**Ajouter des images :** Cliquez sur l'icône d'image pour télécharger une image pour la question. C'est idéal pour les tâches "Qu'est-ce que c'est ?" ou "Trouvez le [Couleur/Forme]".

**Gérer les options :** Chaque question commence avec 2 options. Cliquez sur "+ Ajouter" pour ajouter jusqu'à 4 choix (A, B, C et D).

**Définir la réponse :** Cliquez sur la bulle de lettre (A, B, C ou D) à côté du bon choix. Elle deviendra verte pour montrer qu'elle est enregistrée comme la bonne réponse.

**Ajouter plus :** Cliquez sur "➕ Ajouter une question" en bas pour construire un quiz complet.

---

#### 2. Sélectionner les concurrents

C'est une bataille face à face ! Sélectionnez exactement 2 étudiants de votre liste de classe.

Le joueur 1 sera attribué vert et le joueur 2 sera attribué rose.

---

#### 3. Vérification de validation

Le bouton "Jouer" ne se déverrouillera qu'une fois que toutes vos questions ont du texte et une bonne réponse sélectionnée. Si une question est incomplète, le jeu la mettra en évidence pour que vous la corrigiez.`
  },
  'faceoff-game': {
    title: '🎮 Comment jouer',
    body: `### 🎮 Comment jouer

#### L'objectif
Soyez le plus rapide à associer le mot au centre avec la bonne image de votre côté de l'écran.

---

#### L'écran de jeu

L'écran est divisé en deux moitiés (une pour chaque joueur).

Un mot cible (ou une image, selon le mode) apparaîtra au centre même de l'écran.

Plusieurs images différentes apparaîtront dans les zones de joueur supérieure et inférieure.

---

#### Comment marquer

Les deux joueurs regardent la cible centrale et se précipitent pour trouver l'image correspondante de leur propre côté.

**Touchez/Cliquez sur la bonne image :** Si vous avez raison, vous gagnez le tour et obtenez un point !

**Attention :** Si vous cliquez sur la mauvaise image, vous serez verrouillé pendant un moment pendant que votre adversaire a une chance de trouver la bonne réponse.

---

#### Gagner le jeu

Le jeu continue pour le nombre de tours que vous avez choisi pendant la configuration.

Après le tour final, le joueur avec le plus de points est déclaré gagnant avec une célébration de confettis.

Bonus enseignant : Tout comme les autres jeux, vous pouvez attribuer des points de classe bonus au gagnant directement depuis l'écran de victoire avant de retourner au portail.

---

#### 📱 Mobile vs Bureau

**Version bureau :** Se joue mieux sur un tableau intelligent ou un grand écran où deux étudiants peuvent se tenir de chaque côté.

**Version mobile :** Spécialement conçue pour les tablettes ou les téléphones, permettant à deux étudiants de s'asseoir l'un en face de l'autre et de jouer sur un seul appareil posé à plat sur une table.`
  },
  'faceoff-config': {
    title: '⚔️ Guide de configuration',
    body: `### ⚔️ Face-Off : Guide de configuration

#### 1. Créez vos paires mot-image

Ce jeu utilise des paires de mots et d'images. Vous avez deux façons de les ajouter :

**Téléchargement en masse :** Glissez-déposez un groupe d'images dans la boîte de téléchargement. Le jeu utilisera automatiquement les noms de fichiers comme mots pour chaque image !

**Saisie manuelle :** Cliquez sur "➕ Ajouter une paire mot-image" pour ajouter un emplacement individuel. Tapez le mot et cliquez sur l'icône d'image pour télécharger une image spécifique pour celui-ci.

*(Note : Vous avez besoin d'au moins 5 paires pour commencer le jeu.)*

---

#### 2. Choisissez vos tours

Utilisez le curseur de tours pour décider combien de matchs les étudiants joueront (de 5 à 20 tours).

---

#### 3. Sélectionnez vos concurrents

Face-Off est une bataille face à face ! Sélectionnez exactement 2 étudiants de votre liste de classe.

Un étudiant sera attribué au côté vert et l'autre au côté bleu.

---

#### 4. Démarrer la bataille

Une fois que vous avez 2 étudiants sélectionnés et au moins 5 paires prêtes, le bouton rouge "Démarrer le jeu" s'activera.`
  },
  'motorace-game': {
    title: '🏁 Comment jouer',
    body: `### 🏁 Comment jouer

#### L'objectif
Soyez la première moto à franchir la ligne d'arrivée à damier ! La piste est automatiquement divisée en étapes en fonction du nombre de mots ou d'images que vous avez ajoutés pendant la configuration.

---

#### Afficher les questions

Cliquez sur le bouton "🖼️ Diaporama" en haut de l'écran à tout moment.

Cela ouvre une vue massive en plein écran de votre mot ou image actuel pour que toute la classe le voie.

Utilisez les flèches gauche et droite pour naviguer dans votre matériel de leçon au fur et à mesure que la course progresse.

---

#### Déplacer les motos

Vous êtes le directeur de course ! Vous contrôlez les motos en fonction des réponses des étudiants :

**Avancer (Accélérer !) :** Un étudiant a-t-il eu la bonne réponse ? Cliquez une fois (ou touchez) sa moto. Vous entendrez le moteur rugir alors qu'ils font une roue arrière et avancent d'un espace.

**Reculer (Déraper !) :** Quelqu'un a-t-il fait une erreur, ou devez-vous émettre une pénalité ? Cliquez droit (ou double touche) sur sa moto pour la faire déraper en arrière d'un espace.

---

#### Gagner la course

Le premier joueur à atteindre l'étape finale franchit la ligne d'arrivée et gagne !

Le jeu se mettra instantanément en pause et affichera un écran de célébration de champion géant complet avec des confettis qui tombent.

Sur l'écran de victoire, vous pouvez cliquer pour attribuer instantanément des points de classe bonus (+1, +2, +3 ou +5) à l'étudiant gagnant avant de quitter la course.`
  },
  'motorace-config': {
    title: '🏍️ Guide de configuration',
    body: `### 🏍️ Jeu MotoRace : Guide de configuration

#### 1. Choisissez votre type de contenu

Recherchez le commutateur Texte/Image en haut.

**Mode texte :** Parfait pour l'orthographe, la lecture ou le vocabulaire. Tapez vos mots dans la boîte (séparés par des virgules) et cliquez sur Ajouter.

**Mode image :** Idéal pour l'identification visuelle. Cliquez sur la zone de téléchargement ou glissez-déposez vos fichiers image pour les ajouter au jeu.

*(Note : Vous devez ajouter au moins 2 mots ou images pour déverrouiller le bouton Démarrer !)*

---

#### 2. Sélectionnez vos coureurs

**Nombre de joueurs :** Choisissez si vous voulez une course de 2, 3 ou 4 joueurs.

**Choisir des étudiants :** Cliquez sur les noms des étudiants de votre liste de classe pour leur attribuer une moto colorée. Vous devez sélectionner le nombre exact d'étudiants que vous avez choisi à l'étape précédente.

---

#### 3. Démarrez vos moteurs
Une fois que votre contenu est chargé et que vos coureurs sont sélectionnés, le bouton orange "Démarrer le jeu" en bas brillera. Cliquez dessus pour vous diriger vers la ligne de départ !`
  },
  'horserace-game': {
    title: '🏁 Comment jouer',
    body: `### 🏁 Comment jouer

#### L'objectif
Soyez le premier cheval à courir du bas de l'écran jusqu'à la ligne d'arrivée en haut !

---

#### Enseigner avec le diaporama

Cliquez sur le bouton "🖼️ Diaporama" en haut pour montrer le mot ou l'image actuel dans un format grand et clair pour toute la classe.

Utilisez les flèches à l'écran pour parcourir votre vocabulaire pendant que les étudiants prennent leur tour.

---

#### Contrôler les chevaux
L'enseignant agit comme arbitre et déplace les chevaux en fonction de la performance de l'étudiant :

**Avancer (Galoper !) :** Si un étudiant répond correctement, cliquez une fois (ou touchez) son cheval. Ils se déplaceront d'un pas plus près de la ligne d'arrivée avec un son de galop.

**Reculer (Trébucher) :** Si un étudiant a besoin d'une correction ou d'un "refaire", cliquez droit (ou double touche) sur son cheval pour le déplacer en arrière d'un pas.

---

#### Le cercle du gagnant

Le premier cheval à atteindre le haut de la piste gagne.

Le jeu déclenchera automatiquement une célébration de confettis et affichera le gagnant.

Vous pouvez attribuer instantanément des points de classe bonus (+1, +2, +3 ou +5) au profil du gagnant directement depuis l'écran de victoire.

---

#### 💡 Conseils d'enseignant pour la course de chevaux

**La règle des "10 éléments" :** Si vous n'avez que 5 mots de vocabulaire mais que vous voulez une course plus longue, entrez chaque mot deux fois. Cela renforce la mémoire par la répétition et garantit que la course ne se termine pas trop rapidement.

**Exercices de phonétique :** Ce jeu est excellent pour les "Paires minimales" (mots qui sonnent de manière similaire comme ship/sheep). Utilisez le diaporama pour basculer rapidement entre eux pour voir si les étudiants peuvent repérer la différence.

**Gérer l'énergie :** Parce que les chevaux se déplacent verticalement et que la compétition est visible, les étudiants peuvent devenir bruyants ! Utilisez la mécanique de clic droit (Reculer) comme une "pénalité" douce pour les étudiants qui crient des réponses hors tour, encourageant une meilleure discipline en classe.

**Rythme dynamique :** Si un étudiant est loin devant, vous pouvez concentrer vos questions sur les étudiants à la traîne pour garder la course "au coude à coude", ce qui maintient un engagement élevé pour toute la classe jusqu'à la fin.`
  },
  'horserace-config': {
    title: '🐎 Guide de configuration',
    body: `### 🐎 Course de chevaux : Guide de configuration

#### 1. Préparez votre contenu de course

**Exigence minimale :** Vous devez ajouter au moins 10 éléments (mots ou images) pour commencer la course. La longueur de la piste est déterminée par le nombre d'éléments que vous fournissez.

**Mode texte :** Tapez des mots séparés par des virgules ou de nouvelles lignes (par ex., cat, bat, hat) et cliquez sur Ajouter.

**Mode image :** Glissez-déposez des images directement dans la boîte de téléchargement.

*(Note : Le jeu fonctionne mieux lorsque vous avez un élément par "étape" que vous voulez que les étudiants fassent.)*

---

#### 2. Choisissez vos jockeys

**Nombre de joueurs :** Sélectionnez si vous voulez une course de 2, 3 ou 4 chevaux.

**Attribuer des étudiants :** Cliquez sur les noms d'étudiants de votre liste de classe pour les attribuer à une voie colorée. Vous devez sélectionner le nombre exact d'étudiants pour correspondre à votre nombre de joueurs.

---

#### 3. Dirigez-vous vers les pistes

Une fois que vous avez au moins 10 éléments et que vos étudiants sont sélectionnés, le bouton doré "Démarrer le jeu" se déverrouillera.`
  },
  'spelltheword-game': {
    title: '🎮 Comment jouer',
    body: `### 🎮 Comment jouer

#### L'objectif
Regardez l'image fournie et touchez les lettres mélangées dans le bon ordre pour épeler le mot aussi vite que possible.

---

#### Épeler les mots

Une image apparaît au centre de l'écran.

Des tuiles de lettres mélangées sont fournies sous l'image.

**Pour épeler :** Touchez ou cliquez sur les lettres dans la séquence correcte.

**Lettre correcte :** La lettre vole dans l'emplacement du mot avec une animation satisfaisante de "pop".

**Lettre incorrecte :** L'écran tremblera brièvement pour faire savoir à l'étudiant d'essayer une lettre différente.

**Passer :** Si un étudiant est vraiment bloqué, il peut appuyer sur le bouton "Passer" pour passer au mot suivant (aucun point n'est attribué pour les mots passés).

---

#### Gagner le jeu

Le jeu continue jusqu'à ce que tous les mots de votre liste aient été épelés.

Le joueur avec le plus de mots corrects à la fin gagne le tour.

**Points de classe :** Tout comme vos autres jeux, vous pouvez attribuer des points de classe bonus (+1, +2, +3 ou +5) au gagnant directement depuis l'écran de victoire final.

---

#### 💡 Conseils d'enseignant pour épeler le mot

**L'astuce du "Nom de fichier propre" :** Avant de télécharger des images en masse, prenez une seconde pour les renommer sur votre ordinateur. Si vous voulez que les étudiants épellent "octopus", assurez-vous que le fichier ne s'appelle pas "DSC10293.jpg". Cela vous évite d'avoir à modifier manuellement chaque mot dans l'écran de configuration !

**Difficulté échafaudée :** Pour les débutants, commencez avec des mots CVC de 3 lettres (cat, dog, bat). Au fur et à mesure qu'ils s'améliorent, passez aux mots avec "e muet" ou "digraphes" (sh, ch, th). Parce que le jeu leur fournit les lettres, c'est un excellent moyen "à faible risque" de pratiquer des orthographes difficiles.

**Épellation chorale :** Pendant que les deux étudiants sont en compétition au tableau, encouragez le reste de la classe à épeler le mot à haute voix ensemble une fois qu'il est terminé. Cela renforce la connexion lettre-son pour tout le monde, pas seulement pour les joueurs.

**Concentrez-vous sur les phonèmes :** Si un étudiant est bloqué, au lieu de lui dire la lettre (par ex., "Appuyez sur le P"), donnez-lui le son (par ex., "Quel est le dernier son dans 'Map' ? /p/"). Cela les aide à utiliser leurs connaissances phonétiques pour trouver la bonne tuile.`
  },
  'spelltheword-config': {
    title: '🔠 Guide de configuration',
    body: `### 🔠 Épeler le mot : Guide de configuration

#### 1. Construisez votre liste de mots

**Exigence minimale :** Vous devez ajouter au moins 5 mots pour commencer le jeu.

**Téléchargement en masse d'images :** C'est le moyen le plus rapide de configurer. Glissez-déposez un groupe d'images dans la boîte de téléchargement. Le jeu prendra automatiquement les noms de fichiers de vos images et les transformera en mots cibles (par ex., une image nommée "apple.png" devient le mot "apple") !

**Saisie manuelle :** Utilisez l'onglet "Mots" pour taper des mots spécifiques et télécharger des images correspondantes une par une.

**Traitement de texte :** Si vos noms de fichiers ont des tirets ou des traits de soulignement (comme "ice-cream"), le jeu les nettoiera automatiquement en mots appropriés.

---

#### 2. Choisissez le mode de défi

**Mode 1 joueur :** Idéal pour la pratique individuelle ou avoir un étudiant qui vient au tableau pendant que la classe l'aide.

**Mode 2 joueurs :** Une course d'orthographe face à face ! Sélectionnez 2 étudiants de votre liste de classe pour concourir. Le joueur 1 est attribué vert et le joueur 2 est attribué rose.

---

#### 3. Lancer le concours d'orthographe

Une fois que vous avez vos mots et joueurs prêts, le bouton violet "Démarrer le jeu" s'activera.`
  },
};
