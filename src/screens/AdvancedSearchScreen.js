import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView,
  TouchableOpacity, FlatList, Image, ActivityIndicator, Platform,
  KeyboardAvoidingView, Alert, UIManager, LayoutAnimation, Dimensions, StatusBar,
  Animated, Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { PokemonTheme } from '../theme/PokemonTheme';

if (Platform.OS === 'android') {
  if (typeof UIManager.setLayoutAnimationEnabledExperimental === 'function') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const POKEMON_TYPES = ['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting', 'Colorless', 'Darkness', 'Metal', 'Dragon', 'Fairy'];
const SUPERTYPES = ['Pokémon', 'Trainer', 'Energy'];
const SUBTYPES_POKEMON = ['Basic', 'Stage 1', 'Stage 2', 'V', 'VMAX', 'VSTAR', 'EX', 'GX', 'BREAK', 'Restored', 'LEGEND', 'Radiant'];
const SUBTYPES_TRAINER = ['Item', 'Supporter', 'Stadium', 'Pokémon Tool'];
const SUBTYPES_ENERGY = ['Basic', 'Special'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Rare Holo EX', 'Rare Holo GX', 'Rare Holo LV.X', 'Rare Holo V', 'Rare Holo VMAX', 'Rare Prime', 'Rare Prism Star', 'Rare Rainbow', 'Rare Secret', 'Rare Shining', 'Rare Shiny GX', 'Rare Shiny Holo V', 'Rare Ultra', 'Amazing Rare', 'LEGEND', 'Promo', 'V', 'VMAX', 'Radiant Rare'];
const LEGALITIES_OPTIONS = ['', 'Legal', 'Banned', 'Not Legal'];

const initialFiltersState = {
  searchTerm: '',
  selectedType: '',
  selectedSupertype: '',
  selectedSubtype: '',
  selectedRarity: '',
  selectedSetId: '',
  artistName: '',
  hpRange: { min: '', max: '' },
  retreatCostRange: { min: '', max: '' },
  attackDamageRange: { min: '', max: '' },
  standardLegality: '',
  expandedLegality: '',
};

const AdvancedSearchScreen = ({ navigation }) => {
  const [filters, setFilters] = useState(initialFiltersState);
  const [allSets, setAllSets] = useState([]);
  const [isLoadingSets, setIsLoadingSets] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const animatePokeball = useCallback(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [rotateAnim]);

  const fetchAllSets = useCallback(async () => {
    setIsLoadingSets(true);
    try {
      const response = await fetch('https://api.pokemontcg.io/v2/sets', { headers: { 'X-Api-Key': '4ae3c2ac-cd50-4029-abcb-120be975891f' } });
      const data = await response.json();
      setAllSets(data.data.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)));
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar as coleções");
    } finally {
      setIsLoadingSets(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSets();
    animatePokeball();
  }, [fetchAllSets, animatePokeball]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleRangeFilterChange = (filterName, subField, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: {
        ...prev[filterName],
        [subField]: value.replace(/[^0-9]/g, '')
      }
    }));
  };

  const getSubtypesForSupertype = () => {
    if (filters.selectedSupertype === 'Pokémon') return SUBTYPES_POKEMON;
    if (filters.selectedSupertype === 'Trainer') return SUBTYPES_TRAINER;
    if (filters.selectedSupertype === 'Energy') return SUBTYPES_ENERGY;
    return [];
  };

  const toggleFiltersVisibility = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleResetSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilters(initialFiltersState);
    setSearchResults([]);
    setError(null);
    setSearchAttempted(false);
    setShowFilters(true);
  };

  const executeSearch = async () => {
    setSearchAttempted(true);
    setError(null);
    setIsLoading(true);
    setSearchResults([]);
    setPage(1);

    let queryParts = [];
    if (filters.searchTerm.trim()) queryParts.push(`name:"*${filters.searchTerm.trim()}*"`);
    if (filters.selectedType) queryParts.push(`types:${filters.selectedType}`);
    if (filters.selectedSupertype) queryParts.push(`supertype:${filters.selectedSupertype}`);
    if (filters.selectedSubtype) queryParts.push(`subtypes:"${filters.selectedSubtype}"`);
    if (filters.selectedRarity) queryParts.push(`rarity:"${filters.selectedRarity}"`);
    if (filters.selectedSetId) queryParts.push(`set.id:${filters.selectedSetId}`);
    if (filters.artistName.trim()) queryParts.push(`artist:"*${filters.artistName.trim()}*"`);
    if (filters.hpRange.min || filters.hpRange.max) {
      queryParts.push(`hp:[${filters.hpRange.min || '*'} TO ${filters.hpRange.max || '*'}]`);
    }
    if (filters.retreatCostRange.min || filters.retreatCostRange.max) {
      queryParts.push(`retreatCost:[${filters.retreatCostRange.min || '*'} TO ${filters.retreatCostRange.max || '*'}]`);
    }
    if (filters.attackDamageRange.min || filters.attackDamageRange.max) {
      queryParts.push(`attacks.damage:[${filters.attackDamageRange.min || '*'} TO ${filters.attackDamageRange.max || '*'}]`);
    }
    if (filters.standardLegality) queryParts.push(`legalities.standard:${filters.standardLegality}`);
    if (filters.expandedLegality) queryParts.push(`legalities.expanded:${filters.expandedLegality}`);

    if (queryParts.length === 0) {
      setError("Por favor, insira ao menos um critério de busca.");
      setIsLoading(false);
      return;
    }

    const queryString = queryParts.join(' ');
    const pageSize = 50;

    try {
      const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(queryString)}&page=1&pageSize=${pageSize}`;
      const response = await fetch(url, { headers: { 'X-Api-Key': '4ae3c2ac-cd50-4029-abcb-120be975891f' } });
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setSearchResults(data.data);
        setHasMore(data.page * data.pageSize < data.totalCount);
      } else {
        setSearchResults([]);
        setHasMore(false);
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowFilters(false);
    } catch (err) {
      console.error("Erro ao executar busca: ", err);
      Alert.alert("Erro", `Falha ao buscar: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = page + 1;

    let queryParts = [];
    if (filters.searchTerm.trim()) queryParts.push(`name:"*${filters.searchTerm.trim()}*"`);
    if (filters.selectedType) queryParts.push(`types:${filters.selectedType}`);
    if (filters.selectedSupertype) queryParts.push(`supertype:${filters.selectedSupertype}`);
    if (filters.selectedSubtype) queryParts.push(`subtypes:"${filters.selectedSubtype}"`);
    if (filters.selectedRarity) queryParts.push(`rarity:"${filters.selectedRarity}"`);
    if (filters.selectedSetId) queryParts.push(`set.id:${filters.selectedSetId}`);
    if (filters.artistName.trim()) queryParts.push(`artist:"*${filters.artistName.trim()}*"`);
    if (filters.hpRange.min || filters.hpRange.max) {
      queryParts.push(`hp:[${filters.hpRange.min || '*'} TO ${filters.hpRange.max || '*'}]`);
    }
    if (filters.retreatCostRange.min || filters.retreatCostRange.max) {
      queryParts.push(`retreatCost:[${filters.retreatCostRange.min || '*'} TO ${filters.retreatCostRange.max || '*'}]`);
    }
    if (filters.attackDamageRange.min || filters.attackDamageRange.max) {
      queryParts.push(`attacks.damage:[${filters.attackDamageRange.min || '*'} TO ${filters.attackDamageRange.max || '*'}]`);
    }
    if (filters.standardLegality) queryParts.push(`legalities.standard:${filters.standardLegality}`);
    if (filters.expandedLegality) queryParts.push(`legalities.expanded:${filters.expandedLegality}`);
    
    const queryString = queryParts.join(' ');
    const pageSize = 50;

    try {
      const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(queryString)}&page=${nextPage}&pageSize=${pageSize}`;
      const response = await fetch(url, { headers: { 'X-Api-Key': '4ae3c2ac-cd50-4029-abcb-120be975891f' } });
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setSearchResults(prevResults => [...prevResults, ...data.data]);
        setPage(nextPage);
        setHasMore(data.page * data.pageSize < data.totalCount);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Erro ao carregar mais: ", err);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" color={PokemonTheme.colors.primary} />
      </View>
    );
  };

  const FilterPicker = ({ label, selectedValue, onValueChange, items, iconName }) => (
    <View style={styles.pickerContainer}>
      <Icon name={iconName} size={20} color={PokemonTheme.colors.accent} style={styles.pickerIcon} />
      <Text style={styles.filterLabel}>{label}:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor={PokemonTheme.colors.accent}
        >
          <Picker.Item label={`Todos ${label}`} value="" color={PokemonTheme.colors.placeholderText} />
          {items.map(item => (
            <Picker.Item
              key={typeof item === 'object' ? item.id : item}
              label={typeof item === 'object' ? item.name : item}
              value={typeof item === 'object' ? item.id : item}
              color={PokemonTheme.colors.text}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  const RangeInput = ({ label, valueMin, onChangeMin, valueMax, onChangeMax, iconName }) => (
    <View style={styles.rangeInputSection}>
      <Text style={styles.filterLabel}>
        <Icon name={iconName} size={18} color={PokemonTheme.colors.accent} /> <Text>{label}:</Text>
      </Text>
      <View style={styles.rangeInputContainer}>
        <TextInput
          placeholder="Mín"
          value={valueMin}
          onChangeText={onChangeMin}
          style={styles.inputField}
          keyboardType="number-pad"
          placeholderTextColor={PokemonTheme.colors.placeholderText}
        />
        <TextInput
          placeholder="Máx"
          value={valueMax}
          onChangeText={onChangeMax}
          style={styles.inputField}
          keyboardType="number-pad"
          placeholderTextColor={PokemonTheme.colors.placeholderText}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]}
        style={styles.gradientBackground}
      >
        <StatusBar barStyle="dark-content" backgroundColor={PokemonTheme.colors.background} />

        <LinearGradient
          colors={[PokemonTheme.colors.headerGradientStart, PokemonTheme.colors.headerGradientEnd]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <Animated.Image
              source={require('../../assets/pokeball.png')}
              style={[styles.pokeballIcon, { transform: [{ rotate: rotateInterpolate }] }]}
            />
            <Text style={styles.title}>PokéDex Avançada</Text>
          </View>
        </LinearGradient>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.contentWrapper}
        >
          <View style={styles.topControls}>
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={24} color={PokemonTheme.colors.accent} />
              <TextInput
                placeholder="Buscar cartas..."
                value={filters.searchTerm}
                onChangeText={(text) => handleFilterChange('searchTerm', text)}
                style={styles.searchInput}
                placeholderTextColor={PokemonTheme.colors.placeholderText}
                onSubmitEditing={executeSearch}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={toggleFiltersVisibility}
              >
                <Icon
                  name={showFilters ? "filter-minus" : "filter-plus"}
                  size={20}
                  color={PokemonTheme.colors.accent}
                />
                <Text style={styles.toggleButtonText}>
                  {showFilters ? "Menos Filtros" : "Mais Filtros"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetSearch}
              >
                <Icon name="refresh" size={20} color={PokemonTheme.colors.card} />
                <Text style={styles.resetButtonText}>Limpar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showFilters ? (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.filtersSection}>
                <FilterPicker
                  label="Coleção"
                  selectedValue={filters.selectedSetId}
                  onValueChange={(value) => handleFilterChange('selectedSetId', value)}
                  items={allSets}
                  iconName="cards"
                />

                <FilterPicker
                  label="Tipo Principal"
                  selectedValue={filters.selectedSupertype}
                  onValueChange={(value) => handleFilterChange('selectedSupertype', value)}
                  items={SUPERTYPES}
                  iconName="layers"
                />

                {filters.selectedSupertype && (
                  <FilterPicker
                    label="Subtipo"
                    selectedValue={filters.selectedSubtype}
                    onValueChange={(value) => handleFilterChange('selectedSubtype', value)}
                    items={getSubtypesForSupertype()}
                    iconName="cards-playing"
                  />
                )}

                <FilterPicker
                  label="Tipo Pokémon"
                  selectedValue={filters.selectedType}
                  onValueChange={(value) => handleFilterChange('selectedType', value)}
                  items={POKEMON_TYPES}
                  iconName="pokeball"
                />

                <FilterPicker
                  label="Raridade"
                  selectedValue={filters.selectedRarity}
                  onValueChange={(value) => handleFilterChange('selectedRarity', value)}
                  items={RARITIES}
                  iconName="star"
                />

                <View style={styles.inputContainer}>
                  <Icon name="account" size={24} color={PokemonTheme.colors.accent} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Artista"
                    value={filters.artistName}
                    onChangeText={(text) => handleFilterChange('artistName', text)}
                    style={styles.inputField}
                    placeholderTextColor={PokemonTheme.colors.placeholderText}
                  />
                </View>

                <RangeInput
                  label="HP"
                  valueMin={filters.hpRange.min}
                  onChangeMin={(text) => handleRangeFilterChange('hpRange', 'min', text)}
                  valueMax={filters.hpRange.max}
                  onChangeMax={(text) => handleRangeFilterChange('hpRange', 'max', text)}
                  iconName="heart"
                />

                <RangeInput
                  label="Custo de Recuo"
                  valueMin={filters.retreatCostRange.min}
                  onChangeMin={(text) => handleRangeFilterChange('retreatCostRange', 'min', text)}
                  valueMax={filters.retreatCostRange.max}
                  onChangeMax={(text) => handleRangeFilterChange('retreatCostRange', 'max', text)}
                  iconName="run"
                />

                <RangeInput
                  label="Dano de Ataque"
                  valueMin={filters.attackDamageRange.min}
                  onChangeMin={(text) => handleRangeFilterChange('attackDamageRange', 'min', text)}
                  valueMax={filters.attackDamageRange.max}
                  onChangeMax={(text) => handleRangeFilterChange('attackDamageRange', 'max', text)}
                  iconName="sword"
                />
              </View>

              <TouchableOpacity
                style={styles.searchButton}
                onPress={executeSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={PokemonTheme.colors.primary} />
                ) : (
                  <>
                    <Icon name="magnify" size={24} color={PokemonTheme.colors.primary} />
                    <Text style={styles.searchButtonText}>Buscar Cartas</Text>
                  </>
                )}
              </TouchableOpacity>

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
            </ScrollView>
          ) : (
            <View style={styles.resultsContainer}>
              {isLoading && searchResults.length === 0 ? (
                <View style={styles.loadingContainer}>
                  <Animated.Image
                    source={require('../../assets/pokeball.png')}
                    style={[styles.pokeballIcon, { transform: [{ rotate: rotateInterpolate }] }]}
                  />
                  <Text style={styles.loadingText}>Buscando cartas...</Text>
                </View>
              ) : searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  numColumns={2}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.cardResultContainer}
                      onPress={() => navigation.navigate('CardDetail', { card: item })}
                    >
                      <Image
                        source={{ uri: item.images?.small || 'https://placehold.co/150x210/2A75BB/FFCB05?text=Pok%C3%A9mon' }}
                        style={styles.cardResultImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.cardResultName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.cardResultSet}>{item.set?.name}</Text>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.resultsContent}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={renderFooter}
                />
              ) : searchAttempted ? (
                <View style={styles.emptyContainer}>
                  <Icon name="emoticon-sad" size={60} color={PokemonTheme.colors.accent} />
                  <Text style={styles.emptyText}>Nenhuma carta encontrada</Text>
                  <Text style={styles.emptySubText}>Tente ajustar seus filtros de busca.</Text>
                </View>
              ) : null}
            </View>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PokemonTheme.colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...PokemonTheme.shadows.header,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokeballIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    ...PokemonTheme.textVariants.header,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  topControls: {
    padding: 16,
    paddingBottom: 0,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PokemonTheme.colors.inputBorder,
    ...PokemonTheme.shadows.input,
  },
  searchInput: {
    flex: 1,
    color: PokemonTheme.colors.text,
    marginLeft: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.tabInactiveBackground,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...PokemonTheme.shadows.button,
  },
  toggleButtonText: {
    color: PokemonTheme.colors.accent,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.notification,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...PokemonTheme.shadows.button,
  },
  resetButtonText: {
    color: PokemonTheme.colors.card,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  filtersSection: {
    backgroundColor: PokemonTheme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...PokemonTheme.shadows.card,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerIcon: {
    marginRight: 8,
  },
  filterLabel: {
    ...PokemonTheme.textVariants.inputLabel,
    color: PokemonTheme.colors.text,
    marginRight: 8,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: PokemonTheme.colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PokemonTheme.colors.inputBorder,
    ...PokemonTheme.shadows.input,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: PokemonTheme.colors.text,
  },
  rangeInputSection: {
    marginBottom: 12,
  },
  rangeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputField: {
    flex: 1,
    backgroundColor: PokemonTheme.colors.inputBackground,
    borderRadius: 10,
    padding: 10,
    color: PokemonTheme.colors.text,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: PokemonTheme.colors.inputBorder,
    ...PokemonTheme.shadows.input,
    height: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    borderWidth: 1,
    borderColor: PokemonTheme.colors.inputBorder,
    ...PokemonTheme.shadows.input,
  },
  inputIcon: {
    marginRight: 10,
  },
  searchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.accent,
    borderRadius: 25,
    padding: 16,
    marginBottom: 16,
    ...PokemonTheme.shadows.button,
  },
  searchButtonText: {
    ...PokemonTheme.textVariants.buttonText,
    color: PokemonTheme.colors.primary,
    marginLeft: 8,
  },
  errorText: {
    color: PokemonTheme.colors.notification,
    textAlign: 'center',
    marginBottom: 16,
    ...PokemonTheme.textVariants.body,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: PokemonTheme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    ...PokemonTheme.shadows.header,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: PokemonTheme.colors.primary,
  },
  resultsContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  cardResultContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: PokemonTheme.colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    ...PokemonTheme.shadows.card,
  },
  cardResultImage: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PokemonTheme.colors.border,
  },
  cardResultName: {
    ...PokemonTheme.textVariants.cardTitle,
    marginTop: 8,
    textAlign: 'center',
  },
  cardResultSet: {
    ...PokemonTheme.textVariants.cardSubtitle,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    ...PokemonTheme.textVariants.title,
    color: PokemonTheme.colors.secondaryText,
    marginTop: 16,
    fontSize: 18,
  },
  emptySubText: {
    ...PokemonTheme.textVariants.body,
    color: PokemonTheme.colors.placeholderText,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AdvancedSearchScreen;