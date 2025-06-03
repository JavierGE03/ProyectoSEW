import xml.etree.ElementTree as ET
import os

def xml_to_svg(xml_file_path, archivo_svg, nombre_ruta):
    """Función para transformar un archivo XML de rutas a SVG."""
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
    distancia_acumulada = 0

    for ruta in root.findall('.//ruta'):
        if ruta.find('nombre').text == nombre_ruta:
            # Punto inicial
            inicio = ruta.find('.//punto_inicio/coordenadas')
            if inicio is not None:
                altitud = float(inicio.find('altitud').text)
                x = 0
                y = int(400 - (altitud * 20))
                puntos.append(f"{x},{y}")
                nombres_hitos.append(ruta.find('.//punto_inicio/lugar').text)
                posiciones_hitos.append((x, y))

            # Puntos de los hitos
            for hito in ruta.find('hitos').findall('hito'):
                dist = hito.find('distancia_anterior')
                coords = hito.find('coordenadas')
                if dist is not None and coords is not None:
                    distancia = float(dist.text)
                    altitud = float(coords.find('altitud').text)
                    
                    distancia_acumulada += distancia
                    x = int(distancia_acumulada / 10)
                    y = int(400 - (altitud * 20))
                    
                    puntos.append(f"{x},{y}")
                    nombres_hitos.append(hito.find('nombre').text)
                    posiciones_hitos.append((x, y))

    if puntos:
        # Dibujar línea de cota cero
        archivo_svg.write('<line x1="0" y1="400" x2="800" y2="400" style="stroke:blue;stroke-width:1;stroke-dasharray:5,5"/>\n')
        archivo_svg.write('<text x="10" y="420" font-size="12" fill="blue">Nivel del mar (0m)</text>\n')
        
        # Dibujar el perfil de la ruta
        puntos_str = " ".join(puntos)
        archivo_svg.write(f'<polyline points="{puntos_str}" style="fill:none;stroke:red;stroke-width:2"/>\n')
        
        # Añadir nombres de hitos
        for i, (x, y) in enumerate(posiciones_hitos):
            # Línea vertical para marcar el hito
            archivo_svg.write(f'<line x1="{x}" y1="{y}" x2="{x}" y2="400" style="stroke:gray;stroke-width:1;stroke-dasharray:2,2"/>\n')
            # Nombre del hito rotado para mejor legibilidad
            archivo_svg.write(f'<text x="{x}" y="{y-10}" font-size="10" transform="rotate(-45,{x},{y-10})">{nombres_hitos[i]}</text>\n')
        
        # Añadir ejes y escala
        archivo_svg.write('<line x1="0" y1="400" x2="800" y2="400" style="stroke:black;stroke-width:1"/>\n')  # Eje X
        archivo_svg.write('<line x1="0" y1="0" x2="0" y2="400" style="stroke:black;stroke-width:1"/>\n')  # Eje Y
        
        # Escala
        for i in range(0, 401, 100):
            archivo_svg.write(f'<text x="-20" y="{400-i}" font-size="10">{i/20}m</text>\n')
        for i in range(0, 801, 200):
            archivo_svg.write(f'<text x="{i}" y="420" font-size="10">{i*10}m</text>\n')

def prologoSVG(archivo, nombre):
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="-50 -50 900 550">\n')
    archivo.write(f'<title>Perfil de altitud - {nombre}</title>\n')
    # Añadir leyenda
    archivo.write('<rect x="650" y="10" width="200" height="80" fill="white" stroke="black"/>\n')
    archivo.write('<text x="660" y="30" font-size="12">Leyenda:</text>\n')
    archivo.write('<line x1="660" y1="45" x2="700" y2="45" style="stroke:red;stroke-width:2"/>\n')
    archivo.write('<text x="710" y="50" font-size="12">Perfil de altitud</text>\n')
    archivo.write('<line x1="660" y1="65" x2="700" y2="65" style="stroke:blue;stroke-dasharray:5,5"/>\n')
    archivo.write('<text x="710" y="70" font-size="12">Nivel del mar</text>\n')

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

    for ruta in rutas:
        nombre_archivo = ruta.lower().replace(" ", "_").replace(":", "").replace("ó", "o")
        svg_file = os.path.join(svg_dir, f"{nombre_archivo}.svg")
        
        try:
            with open(svg_file, 'w', encoding='UTF-8') as archivo_svg:
                prologoSVG(archivo_svg, ruta)
                xml_to_svg(xml_file, archivo_svg, ruta)
                epilogoSVG(archivo_svg)
                print(f"Archivo SVG creado correctamente: {svg_file}")
        except IOError as e:
            print(f'Error al procesar la ruta {ruta}: {str(e)}')

if __name__ == "__main__":
    main()