import xml.etree.ElementTree as ET
import os

def xml_to_kml(xml_file_path, archivo_kml, nombre_ruta):
    """Función para transformar un archivo XML de rutas a KML."""
    try:
        tree = ET.parse(xml_file_path)
    except IOError:
        print(f'No se encuentra el archivo: {xml_file_path}')
        exit()
    except ET.ParseError:
        print(f"Error procesando el archivo XML: {xml_file_path}")
        exit()

    root = tree.getroot()

    # Escribir coordenadas del punto inicial
    for ruta in root.findall('.//ruta'):
        if ruta.find('nombre').text == nombre_ruta:
            inicio = ruta.find('.//punto_inicio/coordenadas')
            if inicio is not None:
                longitud = inicio.find('longitud').text
                latitud = inicio.find('latitud').text
                altitud = inicio.find('altitud').text
                archivo_kml.write(f'{longitud},{latitud},{altitud}\n')

            # Escribir coordenadas de los hitos
            for hito in ruta.findall('.//hito'):
                coords = hito.find('coordenadas')
                if coords is not None:
                    longitud = coords.find('longitud').text
                    latitud = coords.find('latitud').text
                    altitud = coords.find('altitud').text
                    archivo_kml.write(f'{longitud},{latitud},{altitud}\n')

def prologoKML(archivo, nombre):
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write(f"<name>{nombre}</name>\n")
    archivo.write("<LineString>\n")
    archivo.write("<extrude>1</extrude>\n")
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style id='lineaRoja'>\n")
    archivo.write("<LineStyle>\n")
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Nombres de las rutas en el XML
    rutas = [
        "Senda del Cervigón",
        "Ruta Gastronómica por Gijón Centro",
        "Ruta Mixta: Tapas y Monumentos en Gijón Centro"
    ]

    # Crear directorio para los KML si no existe
    kml_dir = os.path.join(script_dir, "kml")
    if not os.path.exists(kml_dir):
        os.makedirs(kml_dir)

    # Ruta completa al archivo XML
    xml_file = os.path.join(script_dir, "rutas.xml")
    
    print(f"Buscando archivo XML en: {xml_file}")

    if not os.path.exists(xml_file):
        print(f"Error: No se encuentra el archivo {xml_file}")
        exit()

    for ruta in rutas:
        nombre_archivo = ruta.lower().replace(" ", "_").replace(":", "").replace("ó", "o")
        kml_file = os.path.join(kml_dir, f"{nombre_archivo}.kml")
        
        try:
            with open(kml_file, 'w', encoding='UTF-8') as archivo_kml:
                prologoKML(archivo_kml, ruta)
                xml_to_kml(xml_file, archivo_kml, ruta)
                epilogoKML(archivo_kml)
                print(f"Archivo KML creado correctamente: {kml_file}")
        except IOError as e:
            print(f'Error al procesar la ruta {ruta}: {str(e)}')

if __name__ == "__main__":
    main()