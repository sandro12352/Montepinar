/**
 * Preguntas frecuentes de Montepinar (fuente: video de preguntas frecuentes con el fundador).
 *
 * UNA SOLA FUENTE: la sección visible del FAQ y la ficha para Google (faqJsonLd) deben leer de
 * este archivo, porque Google exige que el marcado coincida con lo que se ve en la página.
 *
 * ESTADO: borrador pendiente de aprobación de la empresa. Las respuestas resumen el video, pero
 * varias son datos sensibles que deben confirmarse antes de publicarse (ver notas `// CONFIRMAR`).
 * Redactar siempre en texto plano, sin HTML.
 *
 * Todas las respuestas hablan del proyecto de Huacho (Asociación de Vivienda Montepinar); si este
 * FAQ se mostrara también en Chancay o Iquitos, las respuestas no les aplicarían.
 */
export interface FaqItem {
  readonly question: string;
  readonly answer: string;
  /** false = se muestra en la página pero NO se incluye en la ficha de Google (opiniones o promesas). */
  readonly inSchema?: boolean;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: '¿Hay transporte a Montepinar?',
    answer:
      'Sí. Por la puerta del proyecto pasan los buses que recorren la ruta Tumbes–Tacna y hay un paradero propio donde se detienen, tanto los que vienen del norte como los que vienen de Lima. Puedes ir y regresar en transporte público.',
  },
  {
    question: 'Si voy pagando mi lote y quiero retirarme, ¿qué pasa con mi dinero?',
    // CONFIRMAR: porcentaje de devolución vigente en el contrato.
    answer:
      'El contrato incluye una cláusula por la que, si por motivos de salud, viaje u otra razón decides retirarte, Montepinar te devuelve el 50% de lo aportado hasta ese momento, sin preguntarte el motivo.',
  },
  {
    question: '¿Montepinar cuenta con zonificación urbana?',
    // CONFIRMAR: hectáreas de cada proyecto.
    answer:
      'Sí. Tanto el primer proyecto de la asociación (232 hectáreas) como el segundo (450 hectáreas) cuentan con zonificación urbana, es decir, 682 hectáreas en total.',
  },
  {
    question: '¿Cuándo tendrán luz, agua, desagüe y demás servicios?',
    // CONFIRMAR: estado actual de cada servicio; no afirmar más de lo que existe.
    answer:
      'Agua: se hizo un estudio hidrogeológico, se obtuvo de la ANA la certificación de existencia hídrica y EMAPA Huacho autorizó la construcción del pozo. Luz: el expediente para solicitar la luz definitiva a Enel está en preparación; mientras tanto se puede usar energía solar fotovoltaica. Desagüe y redes: se ejecutan una vez aprobada la habilitación urbana.',
  },
  {
    question: '¿Desde cuándo puedo empezar a construir en mi terreno?',
    answer:
      'De inmediato. El proyecto ya cuenta con parámetros urbanísticos y edificatorios. Al día siguiente de firmar el contrato, ya sea a crédito o al contado, se te entrega el lote y se te facilita el estudio de suelos con fines de edificación para tu ingeniero o arquitecto.',
  },
  {
    question: '¿Cuál es la documentación legal que entrega Montepinar cuando compro mi lote?',
    answer:
      'Montepinar entrega a cada propietario su título de propiedad, la inscripción del predio como propietario en la Municipalidad de Huaura (impuesto predial) y su memoria descriptiva.',
  },
  {
    question: '¿Qué facilidades de financiamiento da Montepinar para comprar los lotes?',
    // CONFIRMAR: montos vigentes para todos los proyectos.
    answer:
      'Montepinar ofrece trato directo, sin exigir garantía de pago, con una inicial de S/ 4,000 y mensualidades de S/ 500. Si en el camino tienes algún inconveniente, puedes acercarte a administración para encontrar una solución.',
  },
  {
    question: '¿Qué pasa si me atraso en las cuotas de pago?',
    answer:
      'Si tienes algún inconveniente de salud, viaje u otro motivo, conversa con administración y se acordarán facilidades, que pueden ser de uno o dos meses. Montepinar no es un banco ni una financiera.',
  },
  {
    question: '¿Puedo vender o transferir mi lote después de haberlo comprado?',
    answer:
      'Sí. Montepinar no pone objeción a que vendas o transfieras tu lote después de comprarlo; es un derecho de cada propietario.',
  },
  {
    question: '¿El precio del lote incluye todos los gastos o hay pagos adicionales?',
    // CONFIRMAR: el video menciona el predial para valores mayores a S/ 60,000 sin precisión.
    answer:
      'El precio es el del lote tal como está. Los gastos notariales y de memoria descriptiva para obtener el título corren por cuenta del comprador, y el impuesto predial se paga según lo que establece la norma.',
  },
  {
    question: '¿Qué garantía tengo de que el proyecto se ejecutará como me lo ofrecen?',
    // No usar "garantía 100%": es una promesa absoluta que se mostraría en Google.
    answer:
      'El proyecto cuenta con zonificación urbana aprobada por ordenanza municipal. Esto fija la distribución de manzanas, lotes y áreas comunes, por lo que no se puede alterar sin cumplir la norma, y la municipalidad puede actuar de oficio si se incumple.',
  },
  {
    question: '¿Cuál es la visión de Montepinar para los próximos 10 años?',
    // Solo en la página: son proyecciones a futuro, no hechos verificables para un resultado de Google.
    inSchema: false,
    answer:
      'Montepinar se ubica en la zona de influencia del megapuerto de Chancay, que impulsará el desarrollo urbano de Huaral, Chancay, Huacho y Végueta. La empresa proyecta completar un área recreativa para disfrutar en familia y servicios para sus propietarios, como un paradero y una gasolinera.',
  },
];
