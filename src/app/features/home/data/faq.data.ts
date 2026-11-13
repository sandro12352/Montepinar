/**
 * Preguntas frecuentes para la ficha de Google (FAQPage).
 *
 * IMPORTANTE: el texto debe ser IDÉNTICO al que se ve en la página
 * (features/home/components/faq/faq.component.html), porque Google exige que el marcado coincida
 * con el contenido visible. Si alguien cambia una pregunta o respuesta en el HTML, hay que
 * copiar el mismo cambio aquí.
 *
 * Solo se publica en el inicio (home.component.ts), aunque la sección aparezca en otras páginas.
 * Redactar siempre en texto plano, sin HTML.
 *
 * Las notas `// CONFIRMAR` marcan datos sensibles que la empresa debe validar antes de salir en vivo,
 * porque Google los mostrará tal cual.
 */
export interface FaqItem {
  readonly question: string;
  readonly answer: string;
  /** false = se muestra en la página pero NO se incluye en la ficha de Google (proyecciones o promesas). */
  readonly inSchema?: boolean;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: '¿Hay transporte a Montepinar?',
    answer:
      'Sí. Por la puerta pasan todas las empresas que conectan Tumbes con Tacna, y hay un paradero propio donde los buses se detienen, ya sea que vengas del norte o de Lima.',
  },
  {
    question: 'Si voy pagando mi lote y tengo una contingencia, ¿qué pasa con mi dinero?',
    // CONFIRMAR: porcentaje de devolución vigente en el contrato.
    answer:
      'Si decides retirarte por cualquier motivo, el contrato te garantiza la devolución del 50% de lo aportado, sin pedirte explicaciones.',
  },
  {
    question: '¿Montepinar cuenta con zonificación urbana?',
    // CONFIRMAR: hectáreas de cada proyecto.
    answer:
      'Sí. Las 682 ha de Montepinar (232 ha del primer proyecto y 450 ha más) cuentan con zonificación urbana.',
  },
  {
    question: '¿Cuándo tendrán luz, agua, desagüe y demás servicios?',
    // CONFIRMAR: estado actual de cada servicio; no afirmar más de lo que existe.
    answer:
      'Agua: ya tenemos aprobación de la ANA y autorización para el pozo. Luz: el trámite con Enel está en curso y, mientras, puedes usar energía solar sin recibo. Desagüe y redes: tras la habilitación urbana.',
  },
  {
    question: '¿Desde cuándo puedo empezar a construir mi terreno?',
    answer:
      'De inmediato. Ya contamos con parámetros urbanísticos: recibes tu lote al día siguiente de firmar el contrato.',
  },
  {
    question: '¿Qué documentación legal entrega Montepinar al comprar un lote?',
    answer:
      'Tres documentos: tu título de propiedad, la inscripción del predial como propietario en la municipalidad de Huaura y tu memoria descriptiva.',
  },
  {
    question: '¿Qué facilidades de financiamiento da Montepinar?',
    // CONFIRMAR: montos vigentes para todos los proyectos.
    answer:
      'Trato directo, sin exigir garantía de pago: inicial de S/ 4,000 y mensualidades de S/ 500.',
  },
  {
    question: '¿Qué pasa si me atraso en las cuotas de pago?',
    answer:
      'Conversas con administración y te damos facilidades de uno o dos meses. No somos un banco: buscamos una solución contigo.',
  },
  {
    question: '¿Puedo vender o transferir mi lote después de comprarlo?',
    answer:
      'Sí. No ponemos ninguna objeción: si compras hoy y quieres vender mañana, es un derecho legítimo de cada propietario.',
  },
  {
    question: '¿El precio del lote incluye todos los gastos?',
    answer:
      'El lote se entrega tal como está. Los gastos de título, memoria descriptiva y notariales corren por cuenta del comprador, según la norma.',
  },
  {
    question: '¿Qué garantía tengo de que el proyecto se ejecutará como me lo ofrecen?',
    answer:
      'Contamos con zonificación urbana aprobada por ordenanza municipal: parques, avenidas y manzanas quedan fijos y no pueden cambiarse.',
  },
  {
    question: '¿Cuál es la visión de Montepinar en los próximos 10 años?',
    // Solo en la página: son proyecciones a futuro, no hechos verificables para un resultado de Google.
    inSchema: false,
    answer:
      'Con el megapuerto de Chancay como motor de la zona, se proyecta un gran crecimiento urbano, además de un resort familiar. Ya hay casi 1,000 lotes vendidos en Palmeras.',
  },
];
