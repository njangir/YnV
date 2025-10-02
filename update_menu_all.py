import os
import re
from pathlib import Path

# The new menu HTML
NEW_MENU = '''<div class="menu">
          <div class="menu-lang">
            <a href="#" class="menu-lang-item active">Eng</a>
            <a href="#" class="menu-lang-item">fra</a>
            <a href="#" class="menu-lang-item">ger</a>
          </div>


          <div class="menu-main" id="accordion">
            <ul>
              <li class="active"><a data-text="Home" href="index.html" role="button" aria-expanded="false"
                  aria-controls="menuHome">Home</a>
              </li>
              <li><a data-text="Works" data-toggle="collapse" href="#menuWorks" role="button" aria-expanded="true"
                  aria-controls="menuWorks">Works</a>
                <div class="collapse" id="menuWorks" data-parent="#accordion">
                  <ul>
                    <li><a href="workFiles/work-graphic.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="Graphic and Design">Graphic and Design</a></li>
                    <li><a href="workFiles/work-3d.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="Motion Picture/3D Visualization">Motion Picture/3D Visualization</a></li>
                    <li><a href="workFiles/work-web.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="Web Design and Development">Web Design and Development</a></li>
                    <li><a href="workFiles/work-motion.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="Photography">Photography</a></li>
                  </ul>
                </div>
              </li>
              <li><a data-text="Studio" data-toggle="collapse" href="#menuStudio" role="button" aria-expanded="false"
                  aria-controls="menuStudio">Studio</a>
                <div class="collapse" id="menuStudio" data-parent="#accordion">
                  <ul>
                    <li><a href="about-us.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="About Us">About Us</a></li>
                    <li><a href="our-team.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="Our team">Our team</a></li>
                    <li><a href="career.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="Career">Career</a></li>
                    <li><a href="how-its-work.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="How its work">How its work</a></li>
                    <li><a href="service.html" class="animsition-link" data-animsition-out-class="fade-out"
                        data-text="Service">Service</a></li>
                  </ul>
                </div>
              </li>
              <li><a href="contact.html" class="animsition-link" data-animsition-out-class="fade-out"
                  data-text="Contact">Contact</a></li>
            </ul>
          </div>


          <div class="menu-footer">
            <ul class="social social-rounded">
              <li><a href="#"><i class="socicon-twitter"></i></a></li>
              <li><a href="#"><i class="socicon-facebook"></i></a></li>
              <li><a href="#"><i class="socicon-googleplus"></i></a></li>
            </ul>
            <div class="menu-copyright">&copy; 2019 <strong>YardnVision Enterprises</strong>. All Rights Reserved.</div>
          </div>
        </div>'''

def update_menu_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Pattern to find the menu section
        menu_pattern = r'(<div class="menu">.*?<div class="menu-copyright">.*?</div>\s*</div>\s*</div>)'
        
        # Replace the old menu with the new one
        new_content, count = re.subn(menu_pattern, NEW_MENU, content, flags=re.DOTALL)
        
        if count > 0:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"✓ Updated menu in: {file_path}")
            return True
        else:
            print(f"✗ No menu found in: {file_path}")
            return False
            
    except Exception as e:
        print(f"✗ Error processing {file_path}: {str(e)}")
        return False

def main():
    # Get all HTML files in the current directory except index.html
    html_files = [f for f in Path('.').glob('*.html') if f.name != 'index.html']
    updated_count = 0
    
    print(f"Found {len(html_files)} HTML files to process (excluding index.html)...")
    
    for file_path in html_files:
        if update_menu_in_file(str(file_path)):
            updated_count += 1
    
    print(f"\nUpdate complete! Updated {updated_count} out of {len(html_files)} files.")

if __name__ == "__main__":
    main()
