import xml.etree.ElementTree as ET
import os
import math

def xml_to_svg(xml_file_path, archivo_svg, nombre_ruta, ancho_svg=1100, margen_superior=40, margen_inferior=100):
    """Función para transformar un archivo XML de rutas a SVG con escala Y automática."""
    try:
        tree = ET.parse(xml_file_path)
    except IOError:
        print(f'No se encuentra el archivo: {xml_file_path}')
        exit()
    except ET.ParseError:
        print(f"Error procesando el archivo XML: {xml_file_path}")
        exit()

    root = tree.getroot()
    puntos = []
    nombres_hitos = []
    posiciones_hitos = []
    distancias = []
    altitudes = []
    distancia_acumulada = 0

    for ruta in root.findall('.//ruta'):
        if ruta.find('nombre').text == nombre_ruta:
            # Punto inicial
            inicio = ruta.find('.//punto_inicio/coordenadas')
            if inicio is not None:
                altitud = float(inicio.find('altitud').text)
                altitudes.append(altitud)
                x = 0
                nombres_hitos.append(ruta.find('.//punto_inicio/lugar').text)
                posiciones_hitos.append((0, altitud))
                distancias.append(0)

            # Puntos de los hitos
            for hito in ruta.find('hitos').findall('hito'):
                dist = hito.find('distancia_anterior')
                coords = hito.find('coordenadas')
                if dist is not None and coords is not None:
                    distancia = float(dist.text)
                    altitud = float(coords.find('altitud').text)
                    altitudes.append(altitud)
                    distancia_acumulada += distancia
                    nombres_hitos.append(hito.find('nombre').text)
                    posiciones_hitos.append((distancia_acumulada, altitud))
                    distancias.append(distancia_acumulada)

    if posiciones_hitos and distancias:
        max_dist = max(distancias)
        max_alt = max(altitudes)
        escala_y = math.ceil(max_alt / 5) * 5  # Redondea hacia arriba a múltiplo de 5
        alto_svg = int((escala_y * 20) + margen_superior + margen_inferior)

        # Escalar posiciones
        puntos_scaled = []
        posiciones_hitos_scaled = []
        for i, (x, altitud) in enumerate(posiciones_hitos):
            x_scaled = int((x / max_dist) * (ancho_svg - 60)) if max_dist > 0 else 0  # deja margen derecho
            y_scaled = int(alto_svg - margen_inferior - (altitud * 20))
            puntos_scaled.append(f"{x_scaled},{y_scaled}")
            posiciones_hitos_scaled.append((x_scaled, y_scaled))

        y_cero = alto_svg - margen_inferior

        # Línea de cota cero
        archivo_svg.write(f'<line x1="0" y1="{y_cero}" x2="{ancho_svg-60}" y2="{y_cero}" style="stroke:blue;stroke-width:1;stroke-dasharray:5,5"/>\n')
        archivo_svg.write(f'<text x="10" y="{y_cero+20}" font-size="12" fill="blue">Nivel del mar (0m)</text>\n')

        # Perfil de la ruta
        puntos_str = " ".join(puntos_scaled)
        archivo_svg.write(f'<polyline points="{puntos_str}" style="fill:none;stroke:red;stroke-width:2"/>\n')

        # Nombres de hitos y líneas verticales
        for i, (x, y) in enumerate(posiciones_hitos_scaled):
            archivo_svg.write(f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y_cero}" style="stroke:gray;stroke-width:1;stroke-dasharray:2,2"/>\n')
            archivo_svg.write(f'<text x="{x}" y="{y-10}" font-size="10" transform="rotate(-45,{x},{y-10})">{nombres_hitos[i]}</text>\n')

        # Ejes
        archivo_svg.write(f'<line x1="0" y1="{y_cero}" x2="{ancho_svg-60}" y2="{y_cero}" style="stroke:black;stroke-width:1"/>\n')  # Eje X
        archivo_svg.write(f'<line x1="0" y1="{margen_superior}" x2="0" y2="{y_cero}" style="stroke:black;stroke-width:1"/>\n')  # Eje Y

        num_ticks = min(10, escala_y // 5)  # máximo 10 marcas
        for i in range(num_ticks + 1):
            alt = int(i * escala_y / num_ticks)
            y_tick = int(y_cero - (alt * (alto_svg - margen_superior - margen_inferior) / escala_y))
            archivo_svg.write(f'<text x="10" y="{y_tick+5}" font-size="12" text-anchor="start">{alt}m</text>\n')
        # Escala X (distancia)
        pasos_x = max(4, int((ancho_svg-60)/200))
        for i in range(pasos_x+1):
            x_tick = int(i * (ancho_svg-60) / pasos_x)
            metros = int((x_tick/(ancho_svg-60))*max_dist)
            archivo_svg.write(f'<text x="{x_tick}" y="{y_cero+20}" font-size="12">{metros}m</text>\n')

def prologoSVG(archivo, nombre, ancho_svg=1100, alto_svg=700):
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{ancho_svg}" height="{alto_svg}" viewBox="0 0 {ancho_svg} {alto_svg}">\n')
    archivo.write(f'<title>Perfil de altitud - {nombre}</title>\n')
    # Añadir leyenda
    archivo.write(f'<rect x="{ancho_svg-250}" y="10" width="200" height="80" fill="white" stroke="black"/>\n')
    archivo.write(f'<text x="{ancho_svg-240}" y="30" font-size="12">Leyenda:</text>\n')
    archivo.write(f'<line x1="{ancho_svg-240}" y1="45" x2="{ancho_svg-200}" y2="45" style="stroke:red;stroke-width:2"/>\n')
    archivo.write(f'<text x="{ancho_svg-190}" y="50" font-size="12">Perfil de altitud</text>\n')
    archivo.write(f'<line x1="{ancho_svg-240}" y1="65" x2="{ancho_svg-200}" y2="65" style="stroke:blue;stroke-dasharray:5,5"/>\n')
    archivo.write(f'<text x="{ancho_svg-190}" y="70" font-size="12">Nivel del mar</text>\n')

def epilogoSVG(archivo):
    archivo.write('</svg>\n')

def main():
    # Obtener el directorio actual del script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Nombres de las rutas en el XML
    rutas = [
        "Senda del Cervigón",
        "Ruta Gastronómica por Gijón Centro",
        "Ruta Mixta: Tapas y Monumentos en Gijón Centro"
    ]

    # Crear directorio para los SVG si no existe
    svg_dir = os.path.join(script_dir, "svg")
    if not os.path.exists(svg_dir):
        os.makedirs(svg_dir)

    # Ruta completa al archivo XML
    xml_file = os.path.join(script_dir, "rutas.xml")

    print(f"Buscando archivo XML en: {xml_file}")

    if not os.path.exists(xml_file):
        print(f"Error: No se encuentra el archivo {xml_file}")
        exit()

    ancho_svg = 1100

    for ruta in rutas:
        # Calcula el alto óptimo para cada ruta
        # Lee el XML para obtener la altitud máxima
        tree = ET.parse(xml_file)
        root = tree.getroot()
        altitudes = []
        for r in root.findall('.//ruta'):
            if r.find('nombre').text == ruta:
                inicio = r.find('.//punto_inicio/coordenadas')
                if inicio is not None:
                    altitudes.append(float(inicio.find('altitud').text))
                for hito in r.find('hitos').findall('hito'):
                    coords = hito.find('coordenadas')
                    if coords is not None:
                        altitudes.append(float(coords.find('altitud').text))
        if altitudes:
            max_alt = max(altitudes)
            escala_y = math.ceil(max_alt / 5) * 5
            alto_svg = int((escala_y * 20) + 40 + 100)
        else:
            alto_svg = 700

        nombre_archivo = ruta.lower().replace(" ", "_").replace(":", "").replace("ó", "o")
        svg_file = os.path.join(svg_dir, f"{nombre_archivo}.svg")

        try:
            with open(svg_file, 'w', encoding='UTF-8') as archivo_svg:
                prologoSVG(archivo_svg, ruta, ancho_svg, alto_svg)
                xml_to_svg(xml_file, archivo_svg, ruta, ancho_svg, 40, 100)
                epilogoSVG(archivo_svg)
                print(f"Archivo SVG creado correctamente: {svg_file}")
        except IOError as e:
            print(f'Error al procesar la ruta {ruta}: {str(e)}')

if __name__ == "__main__":
    main()